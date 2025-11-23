"""
Membership and payment routes.
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging
import os
import sys
import time

# Add backend to path for database module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from database import get_db, User, Subscription
from .auth import get_current_user_from_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/membership", tags=["membership"])


class CheckoutRequest(BaseModel):
    """Request model for checkout."""

    email: str
    plan: str = "monthly"


class WebhookEvent(BaseModel):
    """Stripe webhook event model."""

    type: str
    data: dict


@router.get("/")
async def get_membership_info() -> dict:
    """Get membership information.

    Returns:
        Dictionary with membership plans and pricing
    """
    return {
        "plans": [
            {
                "id": "monthly",
                "name": "Monthly Membership",
                "price": 20.00,
                "currency": "USD",
                "interval": "month",
                "features": [
                    "Real-time arbitrage data from 5+ exchanges",
                    "Unlimited API requests",
                    "Advanced profit calculator",
                    "Priority support",
                    "Custom alerts",
                ],
            }
        ],
        "demo": {
            "available": True,
            "description": "Try with limited demo data (5 symbols)",
        },
    }


@router.post("/subscribe")
async def create_checkout_session(request: CheckoutRequest) -> dict:
    """Create Stripe checkout session.

    Args:
        request: Checkout request with email and plan

    Returns:
        Dictionary with checkout URL and session information
    """
    # Validate plan
    valid_plans = ["monthly"]
    if request.plan not in valid_plans:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid plan: {request.plan}. Valid plans: {', '.join(valid_plans)}",
        )

    logger.info(f"Creating checkout session for {request.email}, plan: {request.plan}")

    # In production, create actual Stripe checkout session using Stripe SDK
    # import stripe
    # stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    # session = stripe.checkout.Session.create(...)

    # Mock response for now
    mock_session_id = f"cs_test_{int(time.time() * 1000)}"

    return {
        "checkout_url": f"https://checkout.stripe.com/pay/{mock_session_id}",
        "session_id": mock_session_id,
        "message": "Checkout session created (demo mode)",
        "plan": request.plan,
        "email": request.email,
    }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events.

    Args:
        request: Webhook request from Stripe
        db: Database session

    Returns:
        Success response
    """
    try:
        payload = await request.body()
        signature = request.headers.get("stripe-signature")

        # In production, verify webhook signature
        has_signature = signature is not None
        logger.info(f"Received webhook event (has_signature: {has_signature})")

        # Parse event
        event_data = await request.json()
        event_type = event_data.get("type")

        logger.info(f"Processing webhook event: {event_type}")

        # Handle different event types
        if event_type == "checkout.session.completed":
            # Extract user email and subscription info
            session = event_data.get("data", {}).get("object", {})
            customer_email = session.get("customer_email")
            stripe_customer_id = session.get("customer")
            stripe_subscription_id = session.get("subscription")

            if customer_email:
                # Find or create user
                user = db.query(User).filter(User.email == customer_email).first()

                if user:
                    # Update user's stripe customer ID
                    user.stripe_customer_id = stripe_customer_id

                    # Activate subscription
                    subscription = (
                        db.query(Subscription)
                        .filter(Subscription.user_id == user.id)
                        .first()
                    )

                    if subscription:
                        subscription.status = "active"
                        subscription.stripe_subscription_id = stripe_subscription_id
                    else:
                        # Create new subscription
                        import uuid

                        subscription = Subscription(
                            id=str(uuid.uuid4()),
                            user_id=user.id,
                            status="active",
                            plan_type="monthly",
                            stripe_subscription_id=stripe_subscription_id,
                        )
                        db.add(subscription)

                    db.commit()
                    logger.info(f"Subscription activated for user: {user.username}")

        elif event_type == "customer.subscription.deleted":
            # Deactivate subscription
            subscription_id = event_data.get("data", {}).get("object", {}).get("id")

            if subscription_id:
                subscription = (
                    db.query(Subscription)
                    .filter(Subscription.stripe_subscription_id == subscription_id)
                    .first()
                )

                if subscription:
                    subscription.status = "cancelled"
                    db.commit()
                    logger.info(
                        f"Subscription cancelled for user_id: {subscription.user_id}"
                    )

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/status")
async def check_membership_status(
    api_key: str = None, authorization: str = None, db: Session = Depends(get_db)
) -> dict:
    """Check membership status.

    Args:
        api_key: Optional API key
        authorization: Optional authorization header
        db: Database session

    Returns:
        Dictionary with membership status
    """
    user = None

    # Try to get user from JWT token
    if authorization:
        user = await get_current_user_from_token(authorization, db)

    # Try to get user from API key
    if not user and api_key:
        user = db.query(User).filter(User.api_key == api_key).first()

    if not user:
        return {
            "api_key": api_key[:8] + "..." if api_key else None,
            "active": False,
            "plan": None,
            "expires_at": None,
        }

    # Get subscription
    subscription = (
        db.query(Subscription).filter(Subscription.user_id == user.id).first()
    )

    return {
        "username": user.username,
        "api_key": user.api_key[:8] + "..." if user.api_key else None,
        "active": subscription.status == "active" if subscription else False,
        "plan": subscription.plan_type if subscription else None,
        "status": subscription.status if subscription else None,
        "expires_at": subscription.next_billing_date if subscription else None,
    }

"""
Membership and payment routes.
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import logging
import os

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


@router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest) -> dict:
    """Create Stripe checkout session.

    Args:
        request: Checkout request with email and plan

    Returns:
        Dictionary with checkout URL
    """
    # In production, create actual Stripe checkout session
    logger.info(f"Creating checkout session for {request.email}, plan: {request.plan}")

    # Mock response for now
    return {
        "checkout_url": "https://checkout.stripe.com/pay/mock-session-id",
        "session_id": "mock-session-id",
        "message": "Checkout session created (mock)",
    }


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events.

    Args:
        request: Webhook request from Stripe

    Returns:
        Success response
    """
    try:
        payload = await request.body()
        signature = request.headers.get("stripe-signature")

        # In production, verify webhook signature
        logger.info(f"Received webhook event (signature: {signature[:20]}...)")

        # Parse event
        event_data = await request.json()
        event_type = event_data.get("type")

        logger.info(f"Processing webhook event: {event_type}")

        # Handle different event types
        if event_type == "checkout.session.completed":
            # Create/activate membership
            logger.info("Checkout completed, activating membership")
        elif event_type == "customer.subscription.deleted":
            # Deactivate membership
            logger.info("Subscription cancelled, deactivating membership")

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/status")
async def check_membership_status(api_key: str) -> dict:
    """Check membership status for an API key.

    Args:
        api_key: The API key to check

    Returns:
        Dictionary with membership status
    """
    # In production, check database
    return {
        "api_key": api_key[:8] + "...",
        "active": False,
        "plan": None,
        "expires_at": None,
    }

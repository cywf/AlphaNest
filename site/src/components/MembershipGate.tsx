import React, { useState } from 'react';

interface MembershipGateProps {
  onSubscribe?: () => void;
}

export default function MembershipGate({ onSubscribe }: MembershipGateProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          plan: 'monthly',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
      
      if (onSubscribe) {
        onSubscribe();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          {/* Lock Icon */}
          <div className="mb-8">
            <div className="inline-block p-6 bg-primary/20 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Unlock Real-Time Arbitrage Data
          </h1>
          
          <p className="text-xl mb-8 opacity-80">
            Access live cryptocurrency arbitrage opportunities across 5+ exchanges
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
            <div className="flex items-start space-x-3 p-4 bg-base-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold">Real-Time Price Data</h3>
                <p className="text-sm opacity-70">Live updates from Binance, Coinbase, KuCoin, Kraken & Bybit</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-base-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold">Fee-Adjusted Analysis</h3>
                <p className="text-sm opacity-70">Accurate profit calculations including all trading & withdrawal fees</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-base-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold">Unlimited API Access</h3>
                <p className="text-sm opacity-70">Integrate with your own trading bots and systems</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-base-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-bold">Advanced Tools</h3>
                <p className="text-sm opacity-70">Profit calculator, custom alerts, and priority support</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="card bg-base-100 shadow-2xl max-w-md mx-auto">
            <div className="card-body">
              <div className="badge badge-primary badge-lg mb-4">EARLY ADOPTER PRICE</div>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold">
                  $20
                  <span className="text-2xl opacity-70">/month</span>
                </div>
                <p className="text-sm opacity-70 mt-2">Cancel anytime, no commitment</p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="form-control">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="divider">OR</div>

              <a 
                href="/arbitrage?demo=true" 
                className="btn btn-outline btn-secondary w-full"
              >
                Try Demo Mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>

              <p className="text-xs text-center opacity-70 mt-4">
                Secure payment powered by Stripe. Your card information is never stored on our servers.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 text-left">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="join join-vertical w-full">
              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="faq-accordion" defaultChecked />
                <div className="collapse-title text-lg font-medium">
                  What exchanges do you support?
                </div>
                <div className="collapse-content">
                  <p>We currently monitor Binance, Coinbase, KuCoin, Kraken, and Bybit, with more exchanges being added regularly.</p>
                </div>
              </div>

              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-medium">
                  How often is data updated?
                </div>
                <div className="collapse-content">
                  <p>Our data is updated every 5-10 seconds to ensure you have the most current arbitrage opportunities.</p>
                </div>
              </div>

              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-medium">
                  Can I cancel my subscription?
                </div>
                <div className="collapse-content">
                  <p>Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
                </div>
              </div>

              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-medium">
                  Is there an API I can use?
                </div>
                <div className="collapse-content">
                  <p>Yes! All members get full API access with unlimited requests to integrate with their own trading systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

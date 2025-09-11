import React from 'react';
import './styles.css';

function Pricing() {
  return (
    <div className="pricing-container">
      <h1>Pricing Plans</h1>
      <p className="pricing-subtitle">Choose the plan that's right for your business</p>
      
      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-header">
            <h2>Basic</h2>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">29</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-features">
            <ul>
              <li>Up to 5 users</li>
              <li>Basic analytics</li>
              <li>24/7 support</li>
              <li>1GB storage</li>
              <li>Monthly reports</li>
            </ul>
          </div>
          <button className="pricing-button">Get Started</button>
        </div>
        
        <div className="pricing-card featured">
          <div className="pricing-badge">Popular</div>
          <div className="pricing-header">
            <h2>Professional</h2>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">79</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-features">
            <ul>
              <li>Up to 20 users</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>10GB storage</li>
              <li>Weekly reports</li>
              <li>Custom integrations</li>
            </ul>
          </div>
          <button className="pricing-button">Get Started</button>
        </div>
        
        <div className="pricing-card">
          <div className="pricing-header">
            <h2>Enterprise</h2>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">199</span>
              <span className="period">/month</span>
            </div>
          </div>
          <div className="pricing-features">
            <ul>
              <li>Unlimited users</li>
              <li>Enterprise analytics</li>
              <li>Dedicated support</li>
              <li>Unlimited storage</li>
              <li>Daily reports</li>
              <li>Custom integrations</li>
              <li>Advanced security</li>
            </ul>
          </div>
          <button className="pricing-button">Contact Sales</button>
        </div>
      </div>
      
      <div className="pricing-guarantee">
        <p>All plans come with a 14-day free trial. No credit card required.</p>
      </div>
    </div>
  );
}

export default Pricing;

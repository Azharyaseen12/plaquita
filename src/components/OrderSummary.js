import React from "react";
import "./OrderSummary.css"; // Import the CSS file

const OrderSummary = () => {
  return (
    <div className="order-summary-card">
      <h2 className="order-title">Order summary</h2>

      <div className="order-details">
        <div className="order-item">
          <span>Subtotal</span>
          <span className="amount">$12.00</span>
        </div>
        <div className="order-item">
          <span>Estimated shipping</span>
          <a href="#" className="shipping-link">Calculate Shipping</a>
        </div>
        <div className="order-item">
          <span>Sales Tax</span>
          <span className="amount">$11.00</span>
        </div>
        <div className="order-total">
          <span>Total</span>
          <span className="total-amount">$23.00</span>
        </div>
      </div>

      <button className="add-to-cart">Add to Cart</button>

      <div className="buttons-group">
        <button className="order-btn request-help">Request Design Help</button>
        <button className="order-btn coupon">Coupon & Promos</button>
        <button className="order-btn demo">Design Center Demo</button>
      </div>
    </div>
  );
};

export default OrderSummary;

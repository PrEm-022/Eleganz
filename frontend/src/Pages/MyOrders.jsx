import React, { useContext, useEffect, useState } from "react";
import "./CSS/MyOrders.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const STATUS_STEPS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/userorders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const getStepIndex = (status) => {
    const index = STATUS_STEPS.indexOf(status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <div className="my-orders">
        <h1>My Orders & Tracking</h1>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h1>My Orders & Tracking</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>You haven't placed any orders yet!</h2>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);

            return (
              <div className="order-card" key={order._id}>
                {/* Header */}
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {" • "}
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`order-status-badge status-${order.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline Bar */}
                <div className="tracking-timeline">
                  {STATUS_STEPS.map((stepLabel, idx) => {
                    let stepClass = "";
                    if (idx < currentStepIdx) stepClass = "completed";
                    else if (idx === currentStepIdx) stepClass = "active";

                    return (
                      <div className={`timeline-step ${stepClass}`} key={stepLabel}>
                        <div className="step-icon">
                          {idx < currentStepIdx ? "✓" : idx + 1}
                        </div>
                        <span className="step-label">{stepLabel}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Items List */}
                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div className="order-item-row" key={idx}>
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <div className="order-item-details">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">
                          Qty: {item.quantity} × {currency}{item.price}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {currency}{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="order-footer">
                  <div>
                    <strong>Payment Method:</strong> {order.paymentMethod}{" "}
                    <span
                      style={{
                        color: order.paymentStatus ? "#2e7d32" : "#d32f2f",
                        fontSize: "13px",
                      }}
                    >
                      ({order.paymentStatus ? "Paid" : "Pending COD"})
                    </span>
                  </div>
                  <div className="order-total-price">
                    Total: {currency}{order.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

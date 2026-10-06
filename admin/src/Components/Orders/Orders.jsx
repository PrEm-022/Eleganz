import React, { useEffect, useState } from "react";
import "./Orders.css";

const STATUS_OPTIONS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/listorders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch("http://localhost:4000/updatestatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((ord) =>
            ord._id === orderId ? { ...ord, status: newStatus } : ord
          )
        );
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== "Delivered"
  ).length;

  if (loading) {
    return (
      <div className="admin-orders">
        <h1>Order Management</h1>
        <p>Loading orders from database...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <h1>Customer Orders Management</h1>

      {/* Metrics Header */}
      <div className="admin-metrics">
        <div className="metric-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: "#2e7d32" }}>
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: "#f57f17" }}>
          <h3>Pending Delivery</h3>
          <p>{pendingOrdersCount}</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <div className="customer-info">
                  <h4>
                    {order.address.firstName} {order.address.lastName} (
                    {order.address.phone})
                  </h4>
                  <p>
                    <strong>Email:</strong> {order.address.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address.street},{" "}
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.zipcode}
                  </p>
                </div>
                <div className="order-meta-info">
                  <p style={{ fontSize: "12px", color: "#888" }}>
                    ID: #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>
                    Status:{" "}
                  </label>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="admin-order-items">
                {order.items.map((item, idx) => (
                  <div className="admin-order-item-row" key={idx}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="admin-order-item-img"
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Category: {item.category} | Qty: {item.quantity}
                      </div>
                    </div>
                    <div>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div className="admin-order-bottom">
                <div>
                  Payment: <strong>{order.paymentMethod}</strong> (
                  <span
                    style={{
                      color: order.paymentStatus ? "#2e7d32" : "#d32f2f",
                    }}
                  >
                    {order.paymentStatus ? "Paid" : "Pending COD"}
                  </span>
                  )
                </div>
                <div className="order-price-tag">Total: ₹{order.amount}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

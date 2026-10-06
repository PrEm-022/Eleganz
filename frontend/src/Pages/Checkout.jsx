import React, { useContext, useState } from "react";
import "./CSS/Checkout.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { getTotalCartAmount, all_product, cartItems, currency, clearCart } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const changeAddressHandler = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.firstName || !address.phone || !address.street || !address.city || !address.zipcode) {
      alert("Please fill in all required shipping address fields.");
      return;
    }

    // Build items list
    let orderItems = [];
    all_product.forEach((item) => {
      if (cartItems[item.id] > 0) {
        orderItems.push({
          productId: item.id,
          name: item.name,
          image: item.image,
          category: item.category,
          price: item.new_price,
          quantity: cartItems[item.id],
        });
      }
    });

    if (orderItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = getTotalCartAmount();
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    // --- CASH ON DELIVERY (COD) FLOW ---
    if (paymentMethod === "COD") {
      const orderData = {
        items: orderItems,
        amount: totalAmount,
        address: address,
        paymentMethod: "COD",
      };

      try {
        const response = await fetch(`${API_URL}/placeorder`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.success) {
          alert("🎉 Cash on Delivery Order Placed Successfully!");
          clearCart();
          navigate("/myorders");
        } else {
          if (response.status === 401 || data.errors?.includes("token")) {
            alert("Your login session has expired. Please log in again.");
            localStorage.removeItem("auth-token");
            navigate("/login");
            return;
          }
          alert(data.errors || "Failed to place order");
        }
      } catch (error) {
        console.error("COD Order Error:", error);
        alert("Something went wrong while placing order.");
      }
      return;
    }

    // --- RAZORPAY ONLINE PAYMENT FLOW ---
    try {
      // 1. Create Razorpay order on backend
      const createOrderRes = await fetch(`${API_URL}/razorpay/create-order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderResult = await createOrderRes.json();

      if (!orderResult.success || createOrderRes.status === 401) {
        if (createOrderRes.status === 401 || orderResult.errors?.includes("token")) {
          alert("Your login session has expired. Please log in again.");
          localStorage.removeItem("auth-token");
          navigate("/login");
          return;
        }
        alert(orderResult.errors || "Failed to initialize Razorpay order.");
        return;
      }

      const { order, key } = orderResult;

      // 2. Configure Razorpay Popup Modal
      const options = {
        key: key || "rzp_test_TkjyWEfvDQ5eMV",
        amount: order.amount,
        currency: order.currency,
        name: "Eleganz E-Commerce",
        description: "Payment for Order",
        order_id: order.id,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: "#000000",
        },
        handler: async (response) => {
          // 3. Verify Payment Signature on Backend
          try {
            const verifyRes = await fetch(`${API_URL}/razorpay/verify`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "auth-token": token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: orderItems,
                amount: totalAmount,
                address: address,
                paymentMethod: "Razorpay",
              }),
            });

            const verifyResult = await verifyRes.json();

            if (verifyResult.success) {
              alert("🎉 Payment Successful! Order Placed.");
              clearCart();
              navigate("/myorders");
            } else {
              alert("Payment verification failed: " + (verifyResult.errors || "Invalid Signature"));
            }
          } catch (verifyErr) {
            console.error("Verification Error:", verifyErr);
            alert("Payment completed but verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay checkout closed by user.");
          },
        },
      };

      // 4. Open Razorpay Modal
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
      }
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Error processing online payment.");
    }
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        {/* Left Side: Delivery Information & Payment Method */}
        <div className="checkout-left">
          <h2>Delivery Information</h2>
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="form-row">
              <input
                required
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={address.firstName}
                onChange={changeAddressHandler}
              />
              <input
                required
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={address.lastName}
                onChange={changeAddressHandler}
              />
            </div>
            <div className="form-row">
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address *"
                value={address.email}
                onChange={changeAddressHandler}
              />
              <input
                required
                type="text"
                name="phone"
                placeholder="Phone Number *"
                value={address.phone}
                onChange={changeAddressHandler}
              />
            </div>
            <input
              required
              type="text"
              name="street"
              placeholder="Street Address / House No. *"
              value={address.street}
              onChange={changeAddressHandler}
            />
            <div className="form-row">
              <input
                required
                type="text"
                name="city"
                placeholder="City *"
                value={address.city}
                onChange={changeAddressHandler}
              />
              <input
                required
                type="text"
                name="state"
                placeholder="State *"
                value={address.state}
                onChange={changeAddressHandler}
              />
              <input
                required
                type="text"
                name="zipcode"
                placeholder="PIN Code *"
                value={address.zipcode}
                onChange={changeAddressHandler}
              />
            </div>

            <h2 style={{ marginTop: "30px" }}>Select Payment Method</h2>
            <div className="payment-methods">
              <label
                className={`payment-option ${
                  paymentMethod === "Razorpay" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                />
                ⚡ Online Payment (Razorpay - UPI / Cards / NetBanking / Wallets)
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "COD" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                💵 Cash on Delivery (COD)
              </label>
            </div>

            <button type="submit" className="place-order-btn">
              PROCEED TO PAY ({currency}{getTotalCartAmount()})
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="checkout-right">
          <h2>Order Summary</h2>
          <div className="checkout-summary">
            <div className="summary-item">
              <span>Items Subtotal:</span>
              <span>{currency}{getTotalCartAmount()}</span>
            </div>
            <div className="summary-item">
              <span>Shipping Charge:</span>
              <span style={{ color: "#2e7d32", fontWeight: 600 }}>FREE</span>
            </div>
            <div className="summary-item summary-total">
              <span>Total Amount:</span>
              <span>{currency}{getTotalCartAmount()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

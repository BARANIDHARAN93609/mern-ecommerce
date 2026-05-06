import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRazorpay } from "../../hooks/useRazorpay";
import { createOrder } from "../../api/services";
import toast from "react-hot-toast";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, subtotal } = useCart();
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name:    user?.name  || "",
    phone:   user?.phone || "",
    street:  "",
    city:    "",
    state:   "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 2000 ? 0 : 99;
  const tax      = Math.round(subtotal * 0.18);
  const total    = subtotal + shipping + tax;

  const set = (f) => (e) => setAddress((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!address.name.trim())    e.name    = "Required";
    if (address.phone.length !== 10) e.phone = "Enter valid 10-digit phone";
    if (!address.street.trim())  e.street  = "Required";
    if (!address.city.trim())    e.city    = "Required";
    if (!address.state.trim())   e.state   = "Required";
    if (address.pincode.length !== 6) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (!cart.items?.length) { toast.error("Cart is empty"); return; }
    setLoading(true);
    try {
      const { data } = await createOrder({ shippingAddress: address });
      const orderId = data.data._id;

      await initiatePayment({
        orderId,
        user,
        onSuccess: (order) => navigate(`/orders/${order._id}?success=1`),
        onFailure: ()      => navigate(`/orders/${orderId}`),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-layout">

          <div className="checkout-left">
            <div className="card section-card">
              <h2>Shipping Address</h2>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={address.name} onChange={set("name")} />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" maxLength={10} value={address.phone} onChange={set("phone")} />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-input" placeholder="House no, street, area" value={address.street} onChange={set("street")} />
                {errors.street && <p className="form-error">{errors.street}</p>}
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" value={address.city} onChange={set("city")} />
                  {errors.city && <p className="form-error">{errors.city}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-input" value={address.state} onChange={set("state")} />
                  {errors.state && <p className="form-error">{errors.state}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input className="form-input" maxLength={6} value={address.pincode} onChange={set("pincode")} />
                  {errors.pincode && <p className="form-error">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            <div className="card section-card">
              <h2>Order Items</h2>
              {cart.items?.map((item) => (
                <div key={item._id} className="checkout-item">
                  <span className="ci-emoji-sm">{item.product?.emoji || "📦"}</span>
                  <span className="ci-name-sm">{item.name} × {item.quantity}</span>
                  <span className="ci-price-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-right">
            <div className="card section-card">
              <h2>Price Breakdown</h2>
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString("en-IN")}</span></div>
              </div>
              <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>

              <button className="btn btn-primary btn-full rzp-btn" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} via Razorpay`}
              </button>
              <div className="rzp-badge-row">
                <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" height={18} style={{ filter: "grayscale(1) opacity(0.5)" }} />
                <span>Secure · PCI-DSS · 256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

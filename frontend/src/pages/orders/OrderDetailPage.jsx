import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getOrder } from "../../api/services";
import OrderBadge from "../../components/orders/OrderBadge";
import Spinner from "../../components/ui/Spinner";
import "./OrdersPage.css";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(({ data }) => setOrder(data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner center />;
  if (!order)  return <div className="container" style={{ padding: "2rem" }}>Order not found.</div>;

  return (
    <div className="orders-page">
      <div className="container">
        {success && (
          <div className="success-banner">
            ✅ Payment successful! Your order has been placed.
          </div>
        )}
        <div className="order-detail-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <OrderBadge status={order.orderStatus} />
        </div>

        <div className="order-detail-grid">
          <div>
            <div className="card section-card">
              <h2>Items</h2>
              {order.orderItems.map((item) => (
                <div key={item._id} className="checkout-item">
                  <span className="ci-emoji-sm">{item.emoji}</span>
                  <span className="ci-name-sm">{item.name} × {item.quantity}</span>
                  <span className="ci-price-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="card section-card">
              <h2>Shipping Address</h2>
              <p><strong>{order.shippingAddress.name}</strong></p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="card section-card">
            <h2>Payment Summary</h2>
            <div className="summary-rows">
              <div className="summary-row"><span>Items</span><span>₹{order.itemsPrice.toLocaleString("en-IN")}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span></div>
              <div className="summary-row"><span>GST</span><span>₹{order.taxPrice.toLocaleString("en-IN")}</span></div>
            </div>
            <div className="summary-total"><span>Total</span><span>₹{order.totalPrice.toLocaleString("en-IN")}</span></div>

            {order.paymentResult?.razorpay_payment_id && (
              <div className="payment-info">
                <p><strong>Payment ID</strong></p>
                <p className="mono">{order.paymentResult.razorpay_payment_id}</p>
                <p><strong>Razorpay Order</strong></p>
                <p className="mono">{order.paymentResult.razorpay_order_id}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

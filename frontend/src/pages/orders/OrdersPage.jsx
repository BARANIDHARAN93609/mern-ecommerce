import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/services";
import OrderBadge from "../../components/orders/OrderBadge";
import Spinner from "../../components/ui/Spinner";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner center />;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Once you place an order it will appear here</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <OrderBadge status={order.orderStatus} />
                </div>
                <div className="order-items-preview">
                  {order.orderItems.map((item) => (
                    <span key={item._id} className="order-item-chip">{item.emoji} {item.name} ×{item.quantity}</span>
                  ))}
                </div>
                <div className="order-card-footer">
                  <span className="order-total">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                  <span className="view-link">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

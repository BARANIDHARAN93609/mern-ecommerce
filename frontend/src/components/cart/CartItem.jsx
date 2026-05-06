import { useCart } from "../../context/CartContext";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="ci-img">
        {item.product?.image
          ? <img src={item.product.image} alt={item.name} />
          : <span className="ci-emoji">{item.product?.emoji || "📦"}</span>}
      </div>
      <div className="ci-info">
        <p className="ci-name">{item.name}</p>
        <p className="ci-price">₹{item.price.toLocaleString("en-IN")}</p>
      </div>
      <div className="ci-qty">
        <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
        <span>{item.quantity}</span>
        <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
      </div>
      <div className="ci-total">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
      <button className="ci-remove" onClick={() => removeItem(item._id)} aria-label="Remove">✕</button>
    </div>
  );
};

export default CartItem;

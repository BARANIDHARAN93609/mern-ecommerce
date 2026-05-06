import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../api/services";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart,    setCart]    = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await getCart();
      setCart(data.data);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await addToCart({ productId, quantity });
      setCart(data.data);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await updateCartItem(itemId, { quantity });
      setCart(data.data);
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCart((prev) => ({ ...prev, items: prev.items.filter((i) => i._id !== itemId) }));
      toast.success("Item removed");
    } catch (err) { toast.error("Remove failed"); }
  };

  const emptyCart = async () => {
    try { await clearCart(); setCart({ items: [], totalPrice: 0 }); } catch {}
  };

  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const subtotal  = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, subtotal, addItem, updateItem, removeItem, emptyCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

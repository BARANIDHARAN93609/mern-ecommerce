import api from "./axios";

// ── Auth ─────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// ── Products ──────────────────────────────────────
export const fetchProducts = (params) => api.get("/products", { params });
export const fetchProduct = (id) => api.get(`/products/${id}`);
export const fetchCategories = () => api.get("/products/categories");
export const addReview = (id, data) =>
  api.post(`/products/${id}/reviews`, data);

// ── Cart ──────────────────────────────────────────
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart", data);
export const updateCartItem = (itemId, data) =>
  api.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete("/cart");

// ── Orders ────────────────────────────────────────
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getOrder = (id) => api.get(`/orders/${id}`);

// ── Payment ───────────────────────────────────────
export const createRazorpayOrder = (data) =>
  api.post("/payment/create-order", data);
export const verifyPayment = (data) => api.post("/payment/verify", data);

// ── User ─────────────────────────────────────────
export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);
export const changePassword = (data) => api.put("/user/change-password", data);

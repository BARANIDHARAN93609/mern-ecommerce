import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "./components/auth/PrivateRoute";

import HomePage          from "./pages/home/HomePage";
import LoginPage         from "./pages/auth/LoginPage";
import RegisterPage      from "./pages/auth/RegisterPage";
import ProductsPage      from "./pages/products/ProductsPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CartPage          from "./pages/cart/CartPage";
import CheckoutPage      from "./pages/checkout/CheckoutPage";
import OrdersPage        from "./pages/orders/OrdersPage";
import OrderDetailPage   from "./pages/orders/OrderDetailPage";
import ProfilePage       from "./pages/profile/ProfilePage";

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"            element={<HomePage />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<RegisterPage />} />
      <Route path="/products"    element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />

      <Route path="/cart"      element={<PrivateRoute><CartPage /></PrivateRoute>} />
      <Route path="/checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
      <Route path="/orders"    element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
      <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
      <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      <Route path="*" element={
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>404</h1>
          <p>Page not found</p>
        </div>
      } />
    </Routes>
  </>
);

export default App;

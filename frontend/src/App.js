import React from "react";
import { Routes, Route } from "react-router-dom";

// LAYOUT
import UserLayout from "./user/UserLayout";

// ADMIN LAYOUT
import AdminPrivate from "./admin/AdminPrivate";
import AdminLayout from "./admin/component/AdminLayout";

// USER PAGES
import UserLogin from "./user/UserLogin";
import Register from "./user/Register";
import Home from "./user/Home";
import CategoryPage from "./user/CategoryPage";
import ProductDetails from "./user/ProductDetails";
import Cart from "./user/Cart";
import Checkout from "./user/Checkout";
import Orders from "./user/Orders";
import UserProfile from "./user/UserProfile";
import AllProducts from "./user/AllProducts";
import UserPrivate from "./user/UserPrivate";
import Contact from "./user/Contact";
import FAQ from "./user/FAQ";
import Returns from "./user/Returns";
import ShippingPolicy from "./user/ShippingPolicy";

// ADMIN PAGES
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import AdminOrders from "./admin/AdminOrders";
import OrderDetails from "./admin/OrderDetails";
import Users from "./admin/Users";
import Profile from "./admin/Profile";
import AdminProductDetails from "./admin/AdminProductDetails";
import UserDetails from "./admin/UserDetails ";
import TrackOrder from "./user/TrackOrder";
import Wishlist from "./user/Wishlist";
import ForgotPassword from "./user/ForgotPassword";

function App() {
  return (
    <>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>

        {/* ================= USER LAYOUT (Navbar + Footer FIX) ================= */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<UserPrivate><Home /></UserPrivate>} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/cart" element={<UserPrivate><Cart /></UserPrivate>} />
          <Route path="/checkout" element={<UserPrivate><Checkout /></UserPrivate>} />
          <Route path="/orders" element={<UserPrivate><Orders /></UserPrivate>} />
          <Route path="/user-profile" element={<UserPrivate><UserProfile /></UserPrivate>} />
          <Route path="/track/:id" element={<UserPrivate><TrackOrder /></UserPrivate>} />
          <Route path="/wishlist"element={<UserPrivate><Wishlist /></UserPrivate>}/>
          <Route path="/contact" element={<UserPrivate><Contact /></UserPrivate>} />
          <Route path="/faq" element={<UserPrivate><FAQ /></UserPrivate>} />
          <Route path="/returns" element={<UserPrivate><Returns /></UserPrivate>} />
          <Route path="/shipping-policy" element={<UserPrivate><ShippingPolicy /></UserPrivate>} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminPrivate><AdminLayout /></AdminPrivate>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="product/:id" element={<AdminProductDetails />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
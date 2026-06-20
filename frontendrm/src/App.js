import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import Home from "./components/Home";
import Footer from "./components/Footer";
import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";
import ProductDetails from "./components/screens/ProductDetails";
import CartScreens from "./components/screens/CartScreens";
import ShippingScreen from "./components/screens/ShippingScreen";
import PlaceOrderScreens from "./components/screens/PlaceOrderScreens";
import PaymentScreen from "./components/screens/PaymentScreen";
import OrderScreens from "./components/screens/OrderScreens";
import ProductListScreen from "./components/screens/ProductListScreen";
import ProductEditScreen from "./components/screens/ProductEditScreen";
import AdminOrderListScreen from "./components/screens/AdminOrderListScreen";
import AdminUserListScreen from "./components/screens/AdminUserListScreen";
import AdminUserEditScreen from "./components/screens/AdminUserEditScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import { PrivateRoute, AdminRoute } from "./components/PrivateRoute";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/cart/:id?" element={<CartScreens />} />
              <Route path="/checkout" element={<ShippingScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreens />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/order/:id" element={<PrivateRoute><OrderScreens /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
              <Route path="/admin/productlist" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
              <Route path="/admin/orderlist" element={<AdminRoute><AdminOrderListScreen /></AdminRoute>} />
              <Route path="/admin/userlist" element={<AdminRoute><AdminUserListScreen /></AdminRoute>} />
              <Route path="/admin/user/:id/edit" element={<AdminRoute><AdminUserEditScreen /></AdminRoute>} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
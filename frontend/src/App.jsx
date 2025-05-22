import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductProvider from "./contexts/ProductContext";
import CartProvider from "./contexts/CartContext";
import CheckoutProvider from "./contexts/CheckoutContext";
import Customer from "./customer/Customer";
import Login from "./pages/Login";
import Cart from "./customer/Cart";
import Checkout from "./customer/Checkout";
import UserProvider from "./contexts/UserContext";
import Employee from "./employee/Employee";
import EmployeeCheckout from "./employee/EmployeeCheckout";
import EmployeeEditProduct from "./employee/EmployeeEditProduct";
import EmployeeAddProduct from "./employee/EmployeeAddProduct";

function App() {
  return (
    <>
      <div className="flex h-screen bg-white">
        <BrowserRouter>
          <UserProvider>
            <CheckoutProvider>
              <CartProvider>
                <ProductProvider>
                  <Routes>
                    <Route path="/" element={<Customer />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route
                      path="/employee/checkout"
                      element={<EmployeeCheckout />}
                    />
                    <Route
                      path="/employee/product/edit/:productId"
                      element={<EmployeeEditProduct />}
                    />
                    <Route
                      path="/employee/product/add"
                      element={<EmployeeAddProduct />}
                    />
                  </Routes>
                </ProductProvider>
              </CartProvider>
            </CheckoutProvider>
          </UserProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

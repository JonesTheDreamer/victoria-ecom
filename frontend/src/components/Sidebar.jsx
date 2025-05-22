import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { useCheckout } from "../contexts/CheckoutContext";
import { useUser } from "../contexts/UserContext";

const Sidebar = () => {
  const { getAllCarts } = useCart();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { logout } = useUser();

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (token && role === "CUSTOMER") {
        try {
          const response = await getAllCarts();
          const cartItems = response.data;
          setCartItemsCount(cartItems.length);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [getAllCarts, token]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[100%] bg-[#d5c58a] text-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">IHome</h1>
      </div>
      <div className="space-y-4">
        {token ? (
          role === "CUSTOMER" ? (
            <>
              <button
                className=" hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/cart")}
              >
                Cart{" "}
                <span className="bg-[#6e5b14] text-white px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              </button>
              <button
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>
              <button
                onClick={handleLogout}
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className=" hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/employee")}
              >
                Home
              </button>
              <button
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/employee/product/add")}
              >
                Add Product
              </button>
              <button
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold"
                onClick={() => navigate("/employee/checkout")}
              >
                Checkout
              </button>
              <button
                onClick={handleLogout}
                className="hover:bg-[#b4955f] px-4 py-2 w-full font-[Roboto] font-bold text-red-400"
              >
                Logout
              </button>
            </>
          )
        ) : (
          <>
            <p className="block">Please login to purchase</p>
            <button
              className="bg-[#b4955f] hover:bg-[#a88b5a] px-4 py-2 w-full font-[Roboto] font-bold"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

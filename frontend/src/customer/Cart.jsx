import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import Sidebar from "../components/Sidebar";
import { useCheckout } from "../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { getAllCarts, updateCart, deleteCart } = useCart();
  const { createCheckout } = useCheckout();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("token") === "" ||
      sessionStorage.getItem("role") === null ||
      sessionStorage.getItem("role") !== "CUSTOMER"
    ) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const items = await getAllCarts();
    setCartItems(items.data);
    const initialQuantities = {};
    items.data.forEach((item) => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  };

  const totalAmount = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        return total + item.product.price * quantities[item.id];
      }, 0);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      await updateCart(itemId, { quantity: newQuantity, _method: "PUT" });
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: newQuantity,
      }));
    }
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      }
      return [...prevSelectedItems, itemId];
    });
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Must select a product first");
      return;
    }
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    await createCheckout(totalAmount(), selectedCartItems);
    fetchCartItems();
    alert("Thank you for purchasing our products!");
  };

  const handleRemoveItem = async (itemId) => {
    await deleteCart(itemId); // Remove item from cart
    setCartItems(cartItems.filter((item) => item.id !== itemId)); // Remove from local state
  };

  return (
    <>
      <Sidebar />

      <div className="flex-1 p-5 bg-[#f7f7f7] overflow-auto">
        <h1 className="text-2xl font-[Roboto] mb-5">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white shadow-md p-4 rounded-md"
              >
                <div className="flex items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover mr-5"
                  />
                  <div>
                    <h3 className="font-[Roboto] text-lg">
                      {item.product.name}
                    </h3>
                    <p className="text-sm">{item.product.description}</p>
                    <p className="text-md font-bold">P{item.product.price}</p>
                    <p className="text-sm text-zinc-400">
                      Stock: {item.product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <label className="ml-2 text-sm">Include in Checkout</label>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={quantities[item.id] || item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-16 p-2 border rounded-md text-center"
                  />

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 mt-2 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end items-center gap-4">
          <p>Total Amount: P {totalAmount()}</p>
          <button
            onClick={handleCheckout}
            className="bg-[#d5c58a] text-white px-8 py-3 rounded-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;

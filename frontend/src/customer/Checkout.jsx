import React, { useState, useEffect } from "react";
import { useCheckout } from "../contexts/CheckoutContext";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { showUserCheckout } = useCheckout();
  const [checkouts, setCheckouts] = useState([]);
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);
  const [filterDate, setFilterDate] = useState("");
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
    const fetchCheckouts = async () => {
      const data = await showUserCheckout();
      setCheckouts(data.data);
      setFilteredCheckouts(data.data);
    };

    fetchCheckouts();
  }, [showUserCheckout]);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getUniqueDates = () => {
    const allDates = checkouts.map((checkout) =>
      formatDate(checkout.created_at)
    );
    return [...new Set(allDates)];
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
    if (e.target.value === "") {
      setFilteredCheckouts(checkouts);
    } else {
      const filtered = checkouts.filter((checkout) =>
        formatDate(checkout.created_at).includes(e.target.value)
      );
      setFilteredCheckouts(filtered);
    }
  };

  const calculateTotalAmount = (checkout) => {
    return checkout.checkout__product.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <>
      <Sidebar />

      <div className="flex-1 overflow-auto p-5 bg-[#f7f7f7]">
        <h1 className="text-2xl font-[Roboto] mb-5">Your Checkouts</h1>

        <div className="mb-5">
          <label htmlFor="filterDate" className="mr-2 font-[Roboto]">
            Filter by Date:
          </label>
          <select
            id="filterDate"
            value={filterDate}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">All Dates</option>
            {getUniqueDates().map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {filteredCheckouts.length === 0 ? (
          <p>No checkouts found.</p>
        ) : (
          <div className="space-y-5">
            {filteredCheckouts.map((checkout) => (
              <div
                key={checkout.id}
                className="bg-white shadow-md p-5 rounded-md flex flex-col mb-5"
              >
                <h3 className="font-[Roboto] text-xl">
                  Checkout Date: {formatDate(checkout.created_at)}
                </h3>

                <div className="space-y-4 mt-3">
                  {checkout.checkout__product.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:8000/storage/product_image/${item.product.image}`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <div>
                          <h4 className="text-lg font-[Roboto]">
                            {item.product.name}
                          </h4>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                          <p className="text-sm">
                            Total: {item.product.price * item.quantity} PHP
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-5">
                  <span className="font-[Roboto] text-lg">Total Amount:</span>
                  <span className="font-bold text-xl">
                    {calculateTotalAmount(checkout)} PHP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;

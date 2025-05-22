import React, { useState, useEffect } from "react";
import { useCheckout } from "../contexts/CheckoutContext";
import { useProduct } from "../contexts/ProductContext";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const { getAllCheckouts } = useCheckout();
  const { deleteProduct, getAllProducts } = useProduct();
  const [checkouts, setCheckouts] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("token") === "" ||
      sessionStorage.getItem("role") === null ||
      sessionStorage.getItem("role") !== "EMPLOYEE"
    ) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const checkoutData = await getAllCheckouts();
      setCheckouts(checkoutData.data);

      const productData = await getAllProducts();
      setProducts(productData.data);
      console.log(productData.data);

      calculateSummarization(checkoutData.data);
    };

    fetchData();
  }, [getAllCheckouts, getAllProducts]);

  const calculateSummarization = (checkouts) => {
    let revenue = 0;
    let itemsSold = 0;
    let itemSales = {};

    checkouts.forEach((checkout) => {
      checkout.checkout__product.forEach((item) => {
        const itemTotal = item.product.price * item.quantity;
        revenue += itemTotal;
        itemsSold += item.quantity;

        if (itemSales[item.product.id]) {
          itemSales[item.product.id] += item.quantity;
        } else {
          itemSales[item.product.id] = item.quantity;
        }
      });
    });

    console.log(itemSales);

    setTotalRevenue(revenue);
    setTotalItemsSold(itemsSold);
    console.log(itemsSold);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        if (error.status === 400) {
          alert("Product is used in checkout already and can't be deleted");
        }
      }
    }
  };

  return (
    <>
      <Sidebar />

      <div className="w-full overflow-auto p-5 bg-[#f7f7f7]">
        <h1 className="text-2xl font-[Roboto] mb-5">Employee Dashboard</h1>

        <div className="bg-white p-5 shadow-md rounded-md mb-5">
          <h2 className="text-xl font-[Roboto] mb-3">Checkout Summarization</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-[Roboto]">Total Revenue:</span>
              <span className="font-bold">{totalRevenue} PHP</span>
            </div>
            <div className="flex justify-between">
              <span className="font-[Roboto]">Total Items Sold:</span>
              <span className="font-bold">{totalItemsSold}</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-[Roboto] mb-3">Product List</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white shadow-md p-4 rounded-md"
            >
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-48 h-24 object-cover mr-5"
                />
                <div>
                  <h3 className="font-[Roboto] text-lg">{product.name}</h3>
                  <p className="text-sm">{product.description}</p>
                  <p className="text-md font-bold">{product.price} PHP</p>
                  <p className="text-sm">Stock: {product.stock}</p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm mr-3"
                  onClick={() =>
                    navigate(`/employee/product/edit/${product.id}`)
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Employee;

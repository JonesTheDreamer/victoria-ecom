import { createContext, useContext } from "react";
import axios from "./axios";

const CheckoutContext = createContext();

export default function CheckoutProvider({ children }) {
  const getAllCheckouts = async () => {
    const res = await axios.get("/checkouts");
    return res.data;
  };

  const createCheckout = async (total_amount, checkoutProducts) => {
    console.log(checkoutProducts);

    const res = await axios.post("/checkouts", {
      total_amount,
      checkoutProducts,
    });
    return res.data;
  };

  const showUserCheckout = async () => {
    const res = await axios.get("/checkouts/user");
    return res.data;
  };

  return (
    <CheckoutContext.Provider
      value={{ getAllCheckouts, createCheckout, showUserCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => useContext(CheckoutContext);

import { createContext, useContext, useState } from "react";
import axios from "./axios";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", { email, password });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.user.role);
      setUser(res.data.user);
      return res;
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  const logout = async () => {
    await axios.post("/user/logout");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setUser(null);
  };

  const register = async (data) => {
    const res = await axios.post("/user/", data);
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("role", res.data.user.role);
    return res;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

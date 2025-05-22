import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const { login, register } = useUser();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const req = await login(email, password);

    if (req.data.user.role === "CUSTOMER") {
      navigate("/");
    } else {
      navigate("/employee");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    register({ name, email, password });
    alert("Your account is created.");
    setIsLogin(true);
  };

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7] w-full">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-3xl font-[Roboto] text-center mb-5">IHome</h2>

        <div className="flex justify-center mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 px-4 rounded-l-md ${
              isLogin ? "bg-[#d5c58a] text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 px-4 rounded-r-md ${
              !isLogin ? "bg-[#d5c58a] text-white" : "bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-[Roboto]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-[Roboto]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#d5c58a] text-white rounded-md"
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-[Roboto]">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-[Roboto]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-[Roboto]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d5c58a]"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#d5c58a] text-white rounded-md"
              >
                Register
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#d5c58a] cursor-pointer"
            >
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/AuthSlice";
import Cookie from "js-cookie";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = Cookie.get("token");
    console.log("token", token);
    const isAdmin = Cookie.get("isAdmin");
    if (token) {
      if (isAdmin === "true") {
        navigate("/adminhome");
      } else {
        navigate("/profile");
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(input));
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-8 sm:p-12 bg-white shadow-md rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-center mb-6">
            Little<span className="text-pink-500">Love</span>
          </h1>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div className="my-6 border-b text-center w-full">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Sign in with your email
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mx-auto max-w-xs w-full">
            <input
              className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
              type="password"
              name="password"
              value={input.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-4 tracking-wide font-semibold bg-green-400 text-white w-full py-2 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="mt-6 text-xs text-gray-600 text-center">
              I agree to abide by Cartesian Kinetics{" "}
              <a href="#" className="border-b border-gray-500 border-dotted">
                Terms of Service
              </a>{" "}
              and its{" "}
              <a href="#" className="border-b border-gray-500 border-dotted">
                Privacy Policy
              </a>
            </p>
          </form>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

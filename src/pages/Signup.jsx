// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { auth } from "../Firebase/Firebase"; // Import Firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign Up Successful! 🎉");
      navigate("/"); // Redirect to Home Page after Sign Up
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://wallpapercave.com/uwp/uwp4772497.png')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSignup} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="text-white py-2 rounded transition mt-3 bg-[#0C1B33]  "
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-700 mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

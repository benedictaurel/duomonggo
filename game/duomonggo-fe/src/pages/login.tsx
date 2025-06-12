import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Background from "../assets/LoginBackground.png";
import Logos from "../assets/Text.svg";

import "../App.css";

export default function LoginRegister() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8091/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }      const data = await response.json();
      console.log("Login successful:", data.payload);
      localStorage.setItem("username", data.payload.username);
      localStorage.setItem("user_id", data.payload.id);
      localStorage.setItem("role", data.payload.role);

      alert("Login successful!");
      navigate("/courses");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8091/accounts/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data.payload);

      alert("Registration successful! You can now log in.");
      setTab("login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 hidden sm:flex items-center justify-center">
        <img
          src={Background}
          alt="Background"
          className="object-cover w-1/2 h-auto max-lg:w-2/3"
        />
      </div>

      <a href="/" className="mt-10 flex justify-center z-10 max-lg:hidden">
        <img src={Logos} alt="Logo" className="h-12 w-auto" />
      </a>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <a href="/" className="mb-8 lg:hidden">
          <img src={Logos} alt="Logo" className="h-12 w-auto" />
        </a>

        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">{tab === "login" ? "Sign In" : "Register"}</h1>
            <div className="grid grid-cols-2">
              <button
                className={`px-4 py-2 border ${
                  tab === "login"
                    ? "font-bold border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 border ${
                  tab === "register"
                    ? "font-bold border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {tab === "login" && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border p-2 rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600 hover:underline">
                  Need help?
                </div>
              </div>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded flex justify-center items-center transition duration-300 ease-in-out"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          )}

          {tab === "register" && (
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border p-2 rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded flex justify-center items-center transition </svg>duration-300 ease-in-out"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-600 relative z-10">
        <div className="flex justify-center items-center space-x-4">
          <span>© 2025, duomonggo</span>
        </div>
      </footer>
    </div>
  )
}



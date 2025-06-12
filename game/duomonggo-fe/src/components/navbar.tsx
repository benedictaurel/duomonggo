import { Button } from "@/components/ui/button";
import Logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="Duomonggo Logo"
            className="h-10 sm:h-12"
            draggable="false"
          />
          <span className="text-xl sm:text-2xl font-bold text-purple-600">
            Duomonggo
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-0">
          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 text-sm sm:text-base px-2 sm:px-4"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base px-2 sm:px-4"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <span className="text-purple-600 font-medium text-sm sm:text-base">
                Hi, {username}
              </span>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base px-2 sm:px-4"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

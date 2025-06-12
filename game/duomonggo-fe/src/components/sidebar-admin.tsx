import {
  BookOpen,
  LogOut,
  Trophy,
  CirclePlus,
  Drama
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.svg";

export default function SideBarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="fixed h-full overflow-y-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-8">
        <img src={Logo} alt="Logo" className="w-10 h-10" draggable="false" />
        <span className="text-xl font-semibold text-purple-600">duomonggo</span>
      </div>{" "}
      <nav className="space-y-2 w-48">
        <Button
          variant={location.pathname === "/courses" ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            location.pathname === "/courses"
              ? "bg-purple-600 hover:bg-purple-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => navigate("/courses")}
        >
          <BookOpen className="w-5 h-5" />
          Courses
        </Button>
        <Button
          variant={location.pathname === "/leaderboard" ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            location.pathname === "/leaderboard"
              ? "bg-purple-600 hover:bg-purple-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => navigate("/leaderboard")}
        >
          <Trophy className="w-5 h-5" />
          Leaderboard
        </Button>
        <Button
          variant={location.pathname === "/multiplayer" ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            location.pathname === "/multiplayer"
              ? "bg-purple-600 hover:bg-purple-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => navigate("/multiplayer")}
        >
          <Drama className="w-5 h-5" />
          Multiplayer
        </Button>
        <Button
          variant={location.pathname === "/add-course" ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            location.pathname === "/add-course"
              ? "bg-purple-600 hover:bg-purple-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => navigate("/add-course")}
        >
          <CirclePlus className="w-5 h-5" />
          Add Course/Question
        </Button>
      </nav>
      <div className="hidden sm:block mt-10">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:border-red-200 px-10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

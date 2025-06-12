import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LoginRegister from "./pages/login.tsx";
import Home from "./pages/home.tsx";
import Course from "./pages/course.tsx";
import AddCourse from "./pages/add-course.tsx";
import Leaderboard from "./pages/leaderboard.tsx";
import EditProfile from "./pages/edit-profile.tsx";
import Multiplayer from "./pages/multiplayer-courses.tsx";
import CourseMultiplayer from "./pages/course-multiplayer.tsx";
import NotFoundPage from "./pages/404-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/courses" element={<Home />} />
        <Route path="/courses/multiplayer/:courseId" element={<CourseMultiplayer />} />
        <Route path="/courses/:courseId" element={<Course />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </StrictMode>
);

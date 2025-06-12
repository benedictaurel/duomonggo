import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Star, Award, Menu } from "lucide-react";
import SidebarUser from "../components/sidebar-user";
import SidebarAdmin from "../components/sidebar-admin";
import Logo from "../assets/Logo.svg";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expReward: number;
}

export default function LanguageLearningPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCourseCompleted, setIsCourseCompleted] = useState<boolean>(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const storedAccountId = localStorage.getItem("user_id");

    if (!storedUsername) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);
    setAccountId(storedAccountId);
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8091/courses/type/SINGLEPLAYER");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.payload);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const checkCourseCompletion = async (courseId: string) => {
    if (!accountId) return false;

    try {
      const response = await fetch(
        `http://localhost:8091/enrollments/is-completed/user/${accountId}/course/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.payload;
    } catch (err) {
      console.error("Error checking course completion status:", err);
      return false;
    }
  };

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);

    if (accountId) {
      const completed = await checkCourseCompletion(course.id);
      setIsCourseCompleted(completed);
    }

    setIsModalOpen(true);
  };
  const handleEnroll = async () => {
    if (!selectedCourse || !accountId) return;

    if (!isCourseCompleted) {
      try {
        // Start the enrollment
        const response = await fetch(
          "http://localhost:8091/enrollments/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accountId,
              courseId: selectedCourse.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error starting course enrollment:", err);
      }
    }

    setIsModalOpen(false);
    navigate(`/courses/${selectedCourse.id}`);
  };

  const getDifficultyColor = (difficulty: Course["difficulty"]) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "HARD":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden sm:block w-64 bg-white shadow-lg">
        <div className="p-6">
          {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
        </div>
      </div>

      <div className="flex-1">
        <div className="sm:hidden bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Duomonggo Logo" className="h-10 w-10" />
              <span className="text-xl font-semibold text-purple-600">
                Duomonggo
              </span>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-64 p-0"
                title="Navigation Menu" 
                description="Navigation options for Duomonggo application"
              >
                <div className="p-6">
                  {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:border-red-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Hi, {username}! Welcome to{" "}
                <span className="text-purple-600">duomonggo</span>
              </h1>
              <p className="text-gray-600">
                Choose a course to start your Javanese language learning
                journey!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {isLoading ? (
                <div className="col-span-3 flex justify-center items-center py-12">
                  <p className="text-gray-500">Loading courses...</p>
                </div>
              ) : error ? (
                <div className="col-span-3 flex justify-center items-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="col-span-3 flex justify-center items-center py-12">
                  <p className="text-gray-500">
                    No courses available at the moment.
                  </p>
                </div>
              ) : (
                courses.map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0 shadow-md"
                    onClick={() => handleCourseClick(course)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                          {course.title}
                        </CardTitle>
                        <Badge
                          className={getDifficultyColor(course.difficulty)}
                        >
                          {course.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
                          <Star className="w-4 h-4" />
                          {course.expReward} XP
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {selectedCourse?.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <DialogDescription className="text-gray-600 leading-relaxed">
                {selectedCourse.description}
              </DialogDescription>

              <div className="flex justify-center py-4 border-t border-b">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="font-semibold">
                      {selectedCourse.expReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Experience Reward</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">
                    {selectedCourse.difficulty}
                  </span>
                </div>
              </div>
            </div>
          )}{" "}
          <DialogFooter>
            {isCourseCompleted ? (
              <div className="flex items-center text-green-600 font-medium">
                <span>You've already completed this course!</span>
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Enroll Me
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

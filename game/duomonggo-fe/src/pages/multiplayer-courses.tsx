import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import Logo from "../assets/Logo.svg";
import SidebarUser from "../components/sidebar-user";
import SidebarAdmin from "../components/sidebar-admin";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expReward: number;
  courseType: "SINGLEPLAYER" | "MULTIPLAYER";
  deadline?: Date;
}

interface CompletionTime {
  accountId: string;
  courseId?: string;
  completionTime?: number;
  completionTimeSeconds?: number;
  username: string;
  completedAt?: string;
}

export default function MultiplayerCoursesPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(
    new Set()
  );
  const [completionTimes, setCompletionTimes] = useState<
    Record<string, CompletionTime[]>
  >({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAccountId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("role");

    if (!storedUsername || !storedAccountId) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername);
    setAccountId(storedAccountId);
    setRole(storedRole);
  }, [navigate]);

  useEffect(() => {
    fetchMultiplayerCourses();
  }, []);

  useEffect(() => {
    if (accountId && courses.length > 0) {
      for (const course of courses) {
        checkCourseCompletion(accountId, course.id);
        fetchCourseCompletionTimes(course.id);
      }
    }
  }, [accountId, courses]);
  const fetchMultiplayerCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8091/courses/type/MULTIPLAYER"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.payload || []);

    } catch (err) {
      const error = err as Error;
      setError("Failed to fetch multiplayer courses: " + error.message);
      console.error("Error fetching multiplayer courses:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const checkCourseCompletion = async (userId: string, courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8091/multiplayer/is-completed/user/${userId}/course/${courseId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.payload && data.payload.completed) {
          setCompletedCourses((prev) => new Set(prev).add(courseId));
        }
      }
    } catch (err) {
      console.error(`Error checking completion for course ${courseId}:`, err);
    }
  };
  const fetchCourseCompletionTimes = async (courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8091/multiplayer/time/user/${accountId}/course/${courseId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.payload && data.payload.completionTime) {
          setCompletedCourses((prev) => new Set(prev).add(courseId));

          const userCompletionTime = {
            accountId: accountId as string,
            courseId: courseId,
            completionTimeSeconds: data.payload.completionTime,
            username: username || "You",
          };

          setCompletionTimes((prev) => {
            const courseTimesArray = prev[courseId] || [];

            const existingIndex = courseTimesArray.findIndex(
              (entry) => entry.accountId === accountId
            );

            if (existingIndex >= 0) {
              const updatedArray = [...courseTimesArray];
              updatedArray[existingIndex] = userCompletionTime;
              return {
                ...prev,
                [courseId]: updatedArray,
              };
            } else {
              return {
                ...prev,
                [courseId]: [...courseTimesArray, userCompletionTime],
              };
            }
          });
        }
      }
    } catch (err) {
      console.error(
        `Error fetching completion times for course ${courseId}:`,
        err
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  const getUserCompletionTime = (courseId: string): number | null => {
    if (!completionTimes[courseId] || !accountId) return null;

    const userTime = completionTimes[courseId].find(
      (entry) => entry.accountId === accountId
    );

    return userTime
      ? userTime.completionTimeSeconds || userTime.completionTime || null
      : null;
  };

  const isDeadlinePassed = (deadline: Date | undefined) => {
    if (!deadline) return false;

    const bangkokOffset = 7 * 60 * 60 * 1000;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const bangkokNow = new Date(utc + bangkokOffset);

    return new Date(deadline) < bangkokNow;
  };

  const formatBangkokDate = (date: Date | undefined) => {
    if (!date) return "";

    const bangkokOffset = 7 * 60 * 60 * 1000;
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const bangkokTime = new Date(utc + bangkokOffset);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return bangkokTime.toLocaleString("en-US", options);
  };

  const fetchAllCompletionTimes = async (courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8091/multiplayer/time/course/${courseId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.payload) {
        const formattedData = data.payload.map((entry: any) => ({
          accountId: entry.accountId.toString(),
          completionTimeSeconds: entry.completionTime,
          username: entry.username,
          completedAt: entry.completedAt,
        }));

        setCompletionTimes((prev) => ({
          ...prev,
          [courseId]: formattedData,
        }));
      }
    } catch (err) {
      console.error(
        `Error fetching all completion times for course ${courseId}:`,
        err
      );
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Multiplayer Courses
            </h1>
            <p className="text-gray-600 mb-8">
              Race against other players to complete these courses before the
              deadline.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {isLoading && courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No multiplayer courses found</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
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
                      <p className="text-sm text-gray-600 mb-4">
                        {course.description}
                      </p>
                      {course.deadline && (
                        <div
                          className={`text-sm mb-3 ${
                            isDeadlinePassed(course.deadline)
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          <span className="font-medium">Deadline:</span>{" "}
                          {formatBangkokDate(new Date(course.deadline))}
                          {isDeadlinePassed(course.deadline) && (
                            <span className="block mt-1 font-medium">
                              Deadline passed
                            </span>
                          )}
                        </div>
                      )}{" "}
                      <div className="flex justify-between items-center">
                        {" "}
                        <div className="text-sm">
                          {getUserCompletionTime(course.id) !== null ? (
                            <span className="font-medium text-green-600">
                              Your Time:{" "}
                              {formatTime(getUserCompletionTime(course.id)!)}
                            </span>
                          ) : completedCourses.has(course.id) ? (
                            <span className="font-medium text-green-600">
                              Completed
                            </span>
                          ) : null}
                        </div>
                        {getUserCompletionTime(course.id) !== null ||
                        completedCourses.has(course.id) ? (
                          <div className="flex items-center">
                            {" "}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course);
                                fetchAllCompletionTimes(course.id);
                                setShowLeaderboard(true);
                              }}
                            >
                              View Rankings
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={
                              isLoading ||
                              isDeadlinePassed(course.deadline) ||
                              completedCourses.has(course.id) ||
                              getUserCompletionTime(course.id) !== null
                            }
                            size="sm"
                            onClick={() =>
                              navigate(`/courses/multiplayer/${course.id}`)
                            }
                          >
                            {isLoading ? "Loading..." : "Start Course"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>{" "}
        <Dialog
          open={showLeaderboard && !!selectedCourse}
          onOpenChange={setShowLeaderboard}
        >
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            {selectedCourse && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {selectedCourse.title} - Rankings
                  </DialogTitle>
                </DialogHeader>

                {completionTimes[selectedCourse.id]?.length > 0 ? (
                  <div className="divide-y">
                    {completionTimes[selectedCourse.id]
                      .sort(
                        (a, b) =>
                          (a.completionTimeSeconds || a.completionTime || 0) -
                          (b.completionTimeSeconds || b.completionTime || 0)
                      )
                      .map((entry, index) => (
                        <div
                          key={entry.accountId}
                          className={`py-3 flex justify-between ${
                            entry.accountId === accountId
                              ? "bg-purple-50 rounded-md px-2"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-bold w-8">{index + 1}.</span>
                            <span
                              className={
                                entry.accountId === accountId
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {entry.username || "Unknown User"}
                              {entry.accountId === accountId && " (You)"}
                            </span>
                          </div>
                          <span className="text-gray-600">
                            {formatTime(
                              entry.completionTimeSeconds ||
                                entry.completionTime ||
                                0
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    No rankings available yet.
                  </p>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

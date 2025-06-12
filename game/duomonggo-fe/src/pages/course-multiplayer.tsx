import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ArrowLeft,
  Check,
  X,
  HelpCircle,
  Award,
  Clock,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarUser from "../components/sidebar-user";
import SidebarAdmin from "../components/sidebar-admin";
import Logo from "../assets/Logo.svg";

interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  question_id: string;
}

interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  questionType: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  explanation: string;
  answers: Answer[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  expReward: number;
  questions: Question[];
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [shortAnswerText, setShortAnswerText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [enrollmentStarted, setEnrollmentStarted] = useState(false);
  const [completionTimeSeconds, setCompletionTimeSeconds] = useState<
    number | null
  >(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const storedAccountId = localStorage.getItem("user_id");

    if (!storedUsername) {
      navigate("/login");
      return;
    }

    setRole(storedRole);
    setAccountId(storedAccountId);
  }, [navigate]);

  useEffect(() => {
    const startCourseEnrollment = async () => {
      if (!accountId || !courseId || courseCompleted || enrollmentStarted)
        return;

      try {
        const response = await fetch(
          `http://localhost:8091/multiplayer/start?accountId=${encodeURIComponent(
            accountId
          )}&courseId=${encodeURIComponent(courseId)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setEnrollmentStarted(true);
      } catch (err) {
        console.error("Error starting course enrollment:", err);
      }
    };

    if (accountId && courseId) {
      startCourseEnrollment();
    }
  }, [accountId, courseId, courseCompleted, enrollmentStarted]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8091/courses/${courseId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourseData(data.payload);
      } catch (err) {
        setError("Failed to fetch course data. Please try again later.");
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    const fetchCompletionTime = async () => {
      if (!accountId || !courseId || !courseCompleted) return;

      try {
        const response = await fetch(
          `http://localhost:8091/multiplayer/time/user/${accountId}/course/${courseId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.payload && data.payload.completionTime) {
          setCompletionTimeSeconds(data.payload.completionTime);
        }
      } catch (err) {
        console.error("Error fetching completion time:", err);
      }
    };

    if (courseCompleted) {
      fetchCompletionTime();
    }
  }, [accountId, courseId, courseCompleted]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  const handleShortAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortAnswerText(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!courseData || !courseData.questions[currentQuestionIndex]) return;

    const currentQuestion = courseData.questions[currentQuestionIndex];
    let correct = false;

    if (currentQuestion.questionType === "MULTIPLE_CHOICE") {
      const selectedAnswer = currentQuestion.answers.find(
        (answer) => answer.id === selectedAnswerId
      );
      correct = selectedAnswer?.isCorrect || false;
    } else {
      const correctAnswer = currentQuestion.answers.find(
        (answer) => answer.isCorrect
      );
      correct = correctAnswer
        ? shortAnswerText.trim().toLowerCase() ===
          correctAnswer.content.trim().toLowerCase()
        : false;
    }

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }

    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!isCorrect) {
      setShowFeedback(false);
      setSelectedAnswerId(null);
      setShortAnswerText("");
      return;
    }

    setShowFeedback(false);
    setSelectedAnswerId(null);
    setShortAnswerText("");

    if (courseData && currentQuestionIndex < courseData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setCompleted(true);
    }
  };
  const handleReturnToHome = () => {
    const totalQuestions = courseData?.questions.length || 0;
    const isSuccessful =
      totalQuestions > 0 ? score / totalQuestions >= 0.8 : false;

    if (completed && !isSuccessful) {
      setCompleted(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswerId(null);
      setShortAnswerText("");
      setShowFeedback(false);
      setScore(0);
    } else {
      navigate("/multiplayer");
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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const renderQuestion = () => {
    if (!courseData || !courseData.questions[currentQuestionIndex]) {
      return null;
    }

    const question = courseData.questions[currentQuestionIndex];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of{" "}
              {courseData.questions.length}
            </h2>
            <p className="text-gray-600 mt-1">
              {question.questionType === "MULTIPLE_CHOICE"
                ? "Multiple Choice"
                : "Short Answer"}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-800">{question.content}</p>
            {question.imageUrl && (
              <div className="mt-4">
                <img
                  src={question.imageUrl}
                  alt="Question Image"
                  className="w-1/4 mx-auto"
                />
              </div>
            )}
          </div>

          {question.questionType === "MULTIPLE_CHOICE" ? (
            <div className="space-y-3">
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  onClick={() => !showFeedback && handleAnswerSelect(answer.id)}
                  className={`p-4 border rounded-md cursor-pointer transition-all ${
                    selectedAnswerId === answer.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${
                    showFeedback && answer.isCorrect
                      ? "border-green-600 bg-green-50"
                      : showFeedback &&
                        selectedAnswerId === answer.id &&
                        !answer.isCorrect
                      ? "border-red-600 bg-red-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-grow">{answer.content}</div>
                    {showFeedback && answer.isCorrect && (
                      <Check className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />
                    )}
                    {showFeedback &&
                      selectedAnswerId === answer.id &&
                      !answer.isCorrect && (
                        <X className="w-5 h-5 text-red-600 ml-2 flex-shrink-0" />
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <label
                htmlFor="shortAnswer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Answer:
              </label>
              <input
                type="text"
                id="shortAnswer"
                value={shortAnswerText.toUpperCase()}
                onChange={(e) =>
                  handleShortAnswerChange({
                    ...e,
                    target: {
                      ...e.target,
                      value: e.target.value.toUpperCase(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                disabled={showFeedback}
                placeholder="TYPE YOUR ANSWER HERE..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                style={{ textTransform: "uppercase" }}
              />
              {showFeedback && (
                <div
                  className={`mt-3 p-3 rounded-md ${
                    isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <p
                      className={`text-sm ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showFeedback && isCorrect && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <HelpCircle className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
              <h3 className="text-lg font-semibold text-gray-900">
                Explanation
              </h3>
            </div>
            <p className="text-gray-700">{question.explanation}</p>
          </div>
        )}

        {!showFeedback ? (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitAnswer}
              disabled={
                question.questionType === "MULTIPLE_CHOICE"
                  ? !selectedAnswerId
                  : !shortAnswerText.trim()
              }
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2"
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2"
            >
              {isCorrect
                ? currentQuestionIndex < courseData.questions.length - 1
                  ? "Next Question"
                  : "See Results"
                : "Try Again"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const completeCourse = async (isSuccessful: boolean) => {
    if (!accountId || !courseId || courseCompleted) return;

    if (isSuccessful) {
      try {
        console.log(
          `Marking course ${courseId} as complete for user ${accountId}`
        );

        const response = await fetch(
          `http://localhost:8091/multiplayer/complete?accountId=${encodeURIComponent(
            accountId
          )}&courseId=${encodeURIComponent(courseId)}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setCourseCompleted(true);

        const timeResponse = await fetch(
          `http://localhost:8091/multiplayer/time/user/${accountId}/course/${courseId}`
        );

        if (timeResponse.ok) {
          const timeData = await timeResponse.json();
          if (
            timeData.success &&
            timeData.payload &&
            timeData.payload.completionTime
          ) {
            setCompletionTimeSeconds(timeData.payload.completionTime);
          }
        }

        console.log("Course marked as complete successfully");
      } catch (err) {
        console.error("Error marking course as complete:", err);
      }
    }
  };
  useEffect(() => {
    if (!courseData || !completed) return;

    const totalQuestions = courseData.questions.length;
    const isSuccessful = score / totalQuestions >= 0.8;

    if (isSuccessful) {
      completeCourse(true);
    }
  }, [completed, courseData, score, accountId, courseId, courseCompleted]);
  const renderCompletionScreen = () => {
    if (!courseData) return null;

    const totalQuestions = courseData.questions.length;
    const isSuccessful = score / totalQuestions >= 0.8;

    return (
      <div className="text-center py-10 space-y-8">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <Award className="w-24 h-24 text-purple-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Course Completed!
          </h2>
          {completionTimeSeconds !== null && (
            <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold">
              <Clock className="w-5 h-5" />
              <p>Completion time: {formatTime(completionTimeSeconds)}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isSuccessful ? (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg inline-block">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-700 font-medium">
                  {completionTimeSeconds !== null
                    ? `You've completed the course in ${formatTime(
                        completionTimeSeconds
                      )}`
                    : "Course completed successfully!"}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
              <div className="flex items-center">
                <p className="text-yellow-700 font-medium">
                  You need at least 80% to complete this course.
                </p>
              </div>
            </div>
          )}
          <Button
            onClick={handleReturnToHome}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 h-[50px] flex items-center justify-center"
          >
            {isSuccessful ? "Return to Courses" : "Try Again"}
          </Button>
        </div>
      </div>
    );
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
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              {" "}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600"
                onClick={handleReturnToHome}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Multiplayer Courses
              </Button>
              {courseData && (
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {courseData.title}
                  </h1>
                  <Badge className={getDifficultyColor(courseData.difficulty)}>
                    {courseData.difficulty}
                  </Badge>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500">Loading course content...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500">{error}</p>
              </div>
            ) : !courseData ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500">Course not found.</p>
              </div>
            ) : completed ? (
              renderCompletionScreen()
            ) : courseCompleted ? (
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-xl text-purple-700 mb-2">
                  You've already completed this course!
                </h3>
                <p className="text-gray-700 mb-4">
                  You're currently retaking this course. Any new completion will
                  be recorded, but you won't earn additional XP rewards.
                </p>
                {renderQuestion()}
              </div>
            ) : (
              renderQuestion()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

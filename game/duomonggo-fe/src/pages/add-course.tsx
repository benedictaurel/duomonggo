import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Trash, Edit, X } from "lucide-react";
import Logo from "../assets/Logo.svg";
import SidebarAdmin from "../components/sidebar-admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Answer {
  id?: string;
  content: string;
  isCorrect: boolean;
  question_id?: string;
}

interface Question {
  id?: string;
  content: string;
  imageUrl?: string;
  questionType: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  explanation: string;
  orderNumber: number;
  courseId?: string;
  answers: Answer[];
  imageFile?: File;
}

interface Course {
  id?: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expReward: number;
  courseType: "SINGLEPLAYER" | "MULTIPLAYER";
  deadline?: Date;
  questions?: Question[];
}

const CourseForm = ({
  course,
  setCourse,
  isNewCourse = false,
  onSave,
  isLoading,
}: {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  isNewCourse?: boolean;
  onSave: () => void;
  isLoading: boolean;
}) => {
  const handleChange = (updates: Partial<Course>) => {
    setCourse((prev) => {
      if (!prev) return null;

      if (updates.courseType === "MULTIPLAYER") {
        return { ...prev, ...updates, expReward: 0 };
      }

      return { ...prev, ...updates };
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={course.title}
          onChange={(e) => handleChange({ title: e.target.value })}
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Course Title"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={course.description}
          onChange={(e) => handleChange({ description: e.target.value })}
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Course Description"
          rows={4}
          required
        />
      </div>
      <div>
        <label
          htmlFor="difficulty"
          className="block text-sm font-medium text-gray-700"
        >
          Difficulty
        </label>
        <select
          id="difficulty"
          value={course.difficulty}
          onChange={(e) =>
            handleChange({
              difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD",
            })
          }
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          required
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>{" "}
      <div>
        <label
          htmlFor="courseType"
          className="block text-sm font-medium text-gray-700"
        >
          Course Type
        </label>
        <select
          id="courseType"
          value={course.courseType}
          onChange={(e) =>
            handleChange({
              courseType: e.target.value as "SINGLEPLAYER" | "MULTIPLAYER",
            })
          }
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          required
        >
          <option value="SINGLEPLAYER">Singleplayer</option>
          <option value="MULTIPLAYER">Multiplayer</option>
        </select>
      </div>
      {course.courseType === "MULTIPLAYER" && (
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Deadline
          </label>{" "}
          <input
            type="datetime-local"
            id="deadline"
            value={
              course.deadline
                ? new Date(course.deadline).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              if (e.target.value) {
                const inputDate = new Date(e.target.value);
                const bangkokOffset = 7 * 60 * 60 * 1000;
                const utc =
                  inputDate.getTime() - inputDate.getTimezoneOffset() * 60000;
                const bangkokTime = new Date(utc - bangkokOffset);
                handleChange({ deadline: bangkokTime });
              } else {
                handleChange({ deadline: undefined });
              }
            }}
            className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            required={course.courseType === "MULTIPLAYER"}
          />
        </div>
      )}{" "}
      <div>
        <label
          htmlFor="expReward"
          className={`block text-sm font-medium ${
            course.courseType === "MULTIPLAYER"
              ? "text-gray-400"
              : "text-gray-700"
          }`}
        >
          Experience Points Reward{" "}
          {course.courseType === "MULTIPLAYER" && "(Disabled for Multiplayer)"}
        </label>
        <input
          type="number"
          id="expReward"
          value={course.courseType === "MULTIPLAYER" ? 0 : course.expReward}
          onChange={(e) =>
            handleChange({ expReward: parseInt(e.target.value) || 0 })
          }
          className={`w-full p-2 mt-1 border rounded-md ${
            course.courseType === "MULTIPLAYER"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "focus:ring-purple-500 focus:border-purple-500"
          }`}
          min="0"
          required
          disabled={course.courseType === "MULTIPLAYER"}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={
            isLoading ||
            !course.title ||
            !course.description ||
            (course.courseType === "MULTIPLAYER" && !course.deadline)
          }
        >
          {isLoading
            ? "Processing..."
            : isNewCourse
            ? "Create Course"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

const QuestionForm = ({
  question,
  setQuestion,
  isNewQuestion = false,
  onSave,
  isLoading,
  handleFileChange,
  handleAddAnswer,
  handleAnswerDelete,
}: {
  question: Question;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  isNewQuestion?: boolean;
  onSave: () => void;
  isLoading: boolean;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    isForNewQuestion: boolean
  ) => void;
  handleAddAnswer: (isForNewQuestion: boolean) => void;
  handleAnswerDelete?: (answerId: string) => void;
}) => {
  const handleChange = (updates: Partial<Question>) => {
    setQuestion((prev) => {
      if (!prev) return null;

      if (
        Object.prototype.hasOwnProperty.call(updates, "questionType") &&
        updates.questionType === "SHORT_ANSWER"
      ) {
        return {
          ...prev,
          ...updates,
          answers: [{ content: "", isCorrect: true }],
        };
      }
      return { ...prev, ...updates };
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Question Content
        </label>
        <textarea
          id="content"
          value={question.content}
          onChange={(e) => handleChange({ content: e.target.value })}
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Question Content"
          rows={3}
          required
        />
      </div>
      <div>
        <label
          htmlFor="questionType"
          className="block text-sm font-medium text-gray-700"
        >
          Question Type
        </label>
        <select
          id="questionType"
          value={question.questionType}
          onChange={(e) =>
            handleChange({
              questionType: e.target.value as
                | "MULTIPLE_CHOICE"
                | "SHORT_ANSWER",
            })
          }
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          required
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="SHORT_ANSWER">Short Answer</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image (Optional)
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            onChange={(e) => handleFileChange(e, isNewQuestion)}
            className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            accept="image/*"
          />
        </div>
        {question.imageUrl && (
          <div className="mt-2">
            <img
              src={question.imageUrl}
              alt="Question"
              className="h-40 object-contain"
            />
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="explanation"
          className="block text-sm font-medium text-gray-700"
        >
          Explanation
        </label>
        <textarea
          id="explanation"
          value={question.explanation}
          onChange={(e) => handleChange({ explanation: e.target.value })}
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Explanation for the answer"
          rows={3}
          required
        />
      </div>
      <div>
        <label
          htmlFor="orderNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Order Number
        </label>
        <input
          type="number"
          id="orderNumber"
          value={question.orderNumber}
          onChange={(e) =>
            handleChange({ orderNumber: parseInt(e.target.value) || 1 })
          }
          className="w-full p-2 mt-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
          min="1"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answers
        </label>
        {question.answers.map((answer, index) =>
          question.questionType === "SHORT_ANSWER" && index > 0 ? null : (
            <div key={index} className="mb-2 p-3 border rounded-md bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                {" "}
                <label className="text-sm font-medium">
                  Answer {index + 1}
                </label>
                {question.answers.length > 1 && handleAnswerDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => {
                      if (isNewQuestion) {
                        handleAnswerDelete(String(index));
                      } else if (answer.id) {
                        handleAnswerDelete(answer.id);
                      } else {
                        const newAnswers = [...question.answers];
                        newAnswers.splice(index, 1);
                        handleChange({ answers: newAnswers });
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={answer.content}
                  onChange={(e) => {
                    const newAnswers = [...question.answers];
                    newAnswers[index].content = e.target.value;
                    handleChange({ answers: newAnswers });
                  }}
                  className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Answer text"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`correct-${index}`}
                    checked={answer.isCorrect}
                    onChange={() => {
                      const newAnswers = [...question.answers];
                      if (question.questionType === "MULTIPLE_CHOICE") {
                        newAnswers.forEach((a, i) => {
                          a.isCorrect = i === index;
                        });
                      } else {
                        newAnswers[index].isCorrect =
                          !newAnswers[index].isCorrect;
                      }
                      handleChange({ answers: newAnswers });
                    }}
                    className="mr-2 h-4 w-4 text-purple-600"
                  />
                  <label
                    htmlFor={`correct-${index}`}
                    className="text-sm text-gray-700"
                  >
                    Correct
                  </label>
                </div>
              </div>
            </div>
          )
        )}
        {question.questionType === "MULTIPLE_CHOICE" &&
          question.answers.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddAnswer(isNewQuestion)}
              className="mt-2 w-full flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Answer Option
            </Button>
          )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={
            isLoading ||
            !question.content ||
            !question.explanation ||
            question.answers.some((a) => !a.content) ||
            (question.questionType === "MULTIPLE_CHOICE" &&
              !question.answers.some((a) => a.isCorrect))
          }
        >
          {isLoading
            ? "Processing..."
            : isNewQuestion
            ? "Create Question"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default function AddCoursePage() {
  const navigate = useNavigate();
  const [, setUsername] = useState<string | null>(null);
  const [, setRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState<Course | null>({
    title: "",
    description: "",
    difficulty: "EASY",
    expReward: 50,
    courseType: "SINGLEPLAYER",
  });

  // States for questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question | null>({
    content: "",
    questionType: "MULTIPLE_CHOICE",
    explanation: "",
    orderNumber: 1,
    answers: [
      { content: "", isCorrect: true },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
    ],
  });

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!storedUsername) {
      navigate("/login");
      return;
    } else if (storedRole !== "ADMIN") {
      navigate("/404");
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);

    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8091/courses");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data.payload || []);
    } catch (err) {
      const error = err as Error;
      setError("Failed to fetch courses: " + error.message);
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (courseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8091/questions/course/${courseId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data.payload || []);
    } catch (err) {
      setError("Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionAnswers = async (questionId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8091/answers/question/${questionId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.payload || [];
    } catch (err) {
      console.error("Error fetching answers:", err);
      return [];
    }
  };

  // Course CRUD operations
  const handleCreateCourse = async () => {
    if (!newCourse) return;

    setIsLoading(true);
    setError(null);

    try {
      let endpoint = "http://localhost:8091/courses";

      if (newCourse.courseType === "MULTIPLAYER") {
        endpoint = "http://localhost:8091/courses/multiplayer";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        difficulty: "EASY",
        expReward: 50,
        courseType: "SINGLEPLAYER",
      });
      setShowCourseModal(false);
    } catch (err) {
      const error = err as Error;
      setError("Failed to create course: " + error.message);
      console.error("Error creating course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse || !selectedCourse.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let endpoint = `http://localhost:8091/courses/${selectedCourse.id}`;

      if (selectedCourse.courseType === "MULTIPLAYER") {
        endpoint = `http://localhost:8091/courses/multiplayer/${selectedCourse.id}`;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCourse),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCourses();
      setIsEditingCourse(false);
    } catch (err) {
      const error = err as Error;
      setError("Failed to update course: " + error.message);
      console.error("Error updating course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This will also delete all associated questions and answers."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8091/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // Unable to parse JSON response, use default error message
        }

        if (response.status === 400) {
          throw new Error(
            `Cannot delete this course because it has active enrollments or multiplayer sessions. Please remove these first.`
          );
        } else {
          throw new Error(errorMessage);
        }
      }

      await fetchCourses();
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        setQuestions([]);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to delete course");
      console.error("Error deleting course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Question CRUD operations
  const handleCreateQuestion = async () => {
    if (!selectedCourse || !selectedCourse.id || !newQuestion) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", newQuestion.content);
      formData.append("questionType", newQuestion.questionType);
      formData.append("explanation", newQuestion.explanation);
      formData.append("courseId", selectedCourse.id);
      formData.append("orderNumber", String(newQuestion.orderNumber));

      if (newQuestion.imageFile) {
        formData.append("image", newQuestion.imageFile);
      }

      const response = await fetch("http://localhost:8091/questions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const questionData = await response.json();
      const questionId = questionData.payload.id;

      // Create answers for the question
      for (const answer of newQuestion.answers) {
        await fetch("http://localhost:8091/answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: answer.content,
            isCorrect: answer.isCorrect,
            questionId: questionId,
          }),
        });
      }

      await fetchQuestions(selectedCourse.id);
      setNewQuestion({
        content: "",
        questionType: "MULTIPLE_CHOICE",
        explanation: "",
        orderNumber: questions.length + 1,
        answers: [
          { content: "", isCorrect: true },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
        ],
      });
      setShowQuestionModal(false);
    } catch (err) {
      setError("Failed to create question");
      console.error("Error creating question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion || !selectedQuestion.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", selectedQuestion.content);
      formData.append("questionType", selectedQuestion.questionType);
      formData.append("explanation", selectedQuestion.explanation);
      formData.append("courseId", selectedQuestion.courseId || "");
      formData.append("orderNumber", String(selectedQuestion.orderNumber));

      if (selectedQuestion.imageFile) {
        formData.append("image", selectedQuestion.imageFile);
      }

      const response = await fetch(
        `http://localhost:8091/questions/${selectedQuestion.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update answers for the question
      for (const answer of selectedQuestion.answers) {
        if (answer.id) {
          // Update existing answer
          await fetch(`http://localhost:8091/answers/${answer.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: answer.content,
              isCorrect: answer.isCorrect,
              questionId: selectedQuestion.id,
            }),
          });
        } else {
          // Create new answer
          await fetch("http://localhost:8091/answers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: answer.content,
              isCorrect: answer.isCorrect,
              questionId: selectedQuestion.id,
            }),
          });
        }
      }

      if (selectedCourse && selectedCourse.id) {
        await fetchQuestions(selectedCourse.id);
      }
      setIsEditingQuestion(false);
    } catch (err) {
      setError("Failed to update question");
      console.error("Error updating question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this question? This will also delete all associated answers."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8091/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (selectedCourse && selectedCourse.id) {
        await fetchQuestions(selectedCourse.id);
      }
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
    } catch (err) {
      setError("Failed to delete question");
      console.error("Error deleting question:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerDelete = async (answerId: string) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8091/answers/${answerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (selectedQuestion) {
        const updatedAnswers = selectedQuestion.answers.filter(
          (a) => a.id !== answerId
        );
        setSelectedQuestion({
          ...selectedQuestion,
          answers: updatedAnswers,
        });
      }
    } catch (err) {
      setError("Failed to delete answer");
      console.error("Error deleting answer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setIsEditingCourse(false);
    setSelectedQuestion(null);
    setIsEditingQuestion(false);

    if (course.id) {
      await fetchQuestions(course.id);
    }
  };

  const selectQuestion = async (question: Question) => {
    setSelectedQuestion(null);

    // Fetch the answers for this question
    if (question.id) {
      const answers = await fetchQuestionAnswers(question.id);
      setSelectedQuestion({
        ...question,
        answers: answers,
      });
    } else {
      setSelectedQuestion(question);
    }

    setIsEditingQuestion(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isForNewQuestion: boolean
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (isForNewQuestion) {
        setNewQuestion((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            imageFile: file,
            imageUrl: URL.createObjectURL(file),
          };
        });
      } else if (selectedQuestion) {
        setSelectedQuestion({
          ...selectedQuestion,
          imageFile: file,
          imageUrl: URL.createObjectURL(file),
        });
      }
    }
  };

  const handleAddAnswer = (isForNewQuestion: boolean) => {
    if (isForNewQuestion) {
      setNewQuestion((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: [...prev.answers, { content: "", isCorrect: false }],
        };
      });
    } else if (selectedQuestion) {
      setSelectedQuestion({
        ...selectedQuestion,
        answers: [
          ...selectedQuestion.answers,
          { content: "", isCorrect: false },
        ],
      });
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden sm:block w-64 bg-white shadow-lg">
        <div className="p-6">
          <SidebarAdmin />
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
                title="Admin Navigation Menu"
                description="Navigation options for Duomonggo admin panel"
              >
                <div className="p-6">
                  <SidebarAdmin />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Page</h1>
                <p className="text-gray-600 mt-1">
                  Add, edit, or delete courses, questions, and answers.
                </p>
              </div>
              <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>{" "}
                  {newCourse && (
                    <CourseForm
                      course={newCourse}
                      setCourse={setNewCourse}
                      isNewCourse={true}
                      onSave={handleCreateCourse}
                      isLoading={isLoading}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-4 lg:col-span-3">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-semibold mb-4">Courses</h2>
                  {isLoading && courses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Loading courses...
                    </p>
                  ) : courses.length > 0 ? (
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          onClick={() => selectCourse(course)}
                          className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                            selectedCourse?.id === course.id
                              ? "bg-purple-50 border border-purple-200"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="flex gap-1 mt-1">
                              <Badge
                                className={`text-xs ${getDifficultyColor(
                                  course.difficulty
                                )}`}
                              >
                                {course.difficulty}
                              </Badge>
                              <Badge
                                className={`text-xs ${
                                  course.courseType === "MULTIPLAYER"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {course.courseType}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              course.id && handleDeleteCourse(course.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No courses found
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                {selectedCourse ? (
                  <>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle>
                            {isEditingCourse
                              ? "Edit Course"
                              : selectedCourse.title}
                          </CardTitle>
                          {!isEditingCourse ? (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setIsEditingCourse(true)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setIsEditingCourse(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {" "}
                        {isEditingCourse ? (
                          <CourseForm
                            course={selectedCourse}
                            setCourse={setSelectedCourse}
                            onSave={handleUpdateCourse}
                            isLoading={isLoading}
                          />
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Badge
                                  className={getDifficultyColor(
                                    selectedCourse.difficulty
                                  )}
                                >
                                  {selectedCourse.difficulty}
                                </Badge>
                                <Badge
                                  className={
                                    selectedCourse.courseType === "MULTIPLAYER"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }
                                >
                                  {selectedCourse.courseType}
                                </Badge>
                              </div>
                              <div className="text-purple-600 font-medium">
                                {selectedCourse.expReward} XP Reward
                              </div>
                            </div>
                            <p className="text-gray-700">
                              {selectedCourse.description}
                            </p>{" "}
                            {selectedCourse.courseType === "MULTIPLAYER" &&
                              selectedCourse.deadline && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium">Deadline:</span>{" "}
                                  {formatBangkokDate(
                                    new Date(selectedCourse.deadline)
                                  )}{" "}
                                  (Bangkok Time)
                                </div>
                              )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Questions</h2>
                        <Dialog
                          open={showQuestionModal}
                          onOpenChange={setShowQuestionModal}
                        >
                          <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add Question
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Create New Question</DialogTitle>
                            </DialogHeader>{" "}
                            {newQuestion && (
                              <QuestionForm
                                question={newQuestion}
                                setQuestion={setNewQuestion}
                                isNewQuestion={true}
                                onSave={handleCreateQuestion}
                                isLoading={isLoading}
                                handleFileChange={handleFileChange}
                                handleAddAnswer={handleAddAnswer}
                                handleAnswerDelete={(answerId) => {
                                  const updatedAnswers =
                                    newQuestion.answers.filter(
                                      (_, index) => index !== parseInt(answerId)
                                    );
                                  setNewQuestion({
                                    ...newQuestion,
                                    answers: updatedAnswers,
                                  });
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>

                      {isLoading && questions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          Loading questions...
                        </p>
                      ) : questions.length > 0 ? (
                        <div className="space-y-4">
                          {questions
                            .sort((a, b) => a.orderNumber - b.orderNumber)
                            .map((question) => (
                              <div
                                key={question.id}
                                className={`p-4 border rounded-lg ${
                                  selectedQuestion?.id === question.id
                                    ? "border-purple-300 bg-purple-50"
                                    : "border-gray-200 hover:border-purple-200"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div
                                    className="w-full"
                                    onClick={() => selectQuestion(question)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                          {question.orderNumber}.
                                        </span>
                                        <Badge variant="outline">
                                          {question.questionType ===
                                          "MULTIPLE_CHOICE"
                                            ? "Multiple Choice"
                                            : "Short Answer"}
                                        </Badge>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await selectQuestion(question);
                                            setIsEditingQuestion(true);
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-red-500 hover:text-red-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            question.id &&
                                              handleDeleteQuestion(question.id);
                                          }}
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="mt-2 text-gray-700">
                                      {question.content}
                                    </div>
                                    {question.imageUrl && (
                                      <img
                                        src={question.imageUrl}
                                        alt="Question"
                                        className="mt-2 h-24 object-contain"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 mb-4">
                            No questions found for this course
                          </p>
                          <p className="text-gray-600">
                            Add your first question to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Select a Course
                    </h3>
                    <p className="text-gray-500">
                      Select a course from the list or add a new course to get
                      started
                    </p>
                  </div>
                )}

                {selectedQuestion && (
                  <Dialog
                    open={isEditingQuestion}
                    onOpenChange={setIsEditingQuestion}
                  >
                    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                      </DialogHeader>{" "}
                      <QuestionForm
                        question={selectedQuestion}
                        setQuestion={setSelectedQuestion}
                        onSave={handleUpdateQuestion}
                        isLoading={isLoading}
                        handleFileChange={handleFileChange}
                        handleAddAnswer={handleAddAnswer}
                        handleAnswerDelete={handleAnswerDelete}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

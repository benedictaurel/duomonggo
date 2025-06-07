package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.UserProgress;
import com.benedict.duomonggo.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/progress")
public class UserProgressController {
    private final UserProgressService userProgressService;

    @Autowired
    public UserProgressController(UserProgressService userProgressService) {
        this.userProgressService = userProgressService;
    }

    @GetMapping("/user/{accountId}")
    public ResponseEntity<BaseResponse<List<UserProgress>>> getUserProgressByAccountId(@PathVariable Long accountId) {
        List<UserProgress> progressList = userProgressService.getUserProgressByAccountId(accountId);
        return ResponseEntity.ok(new BaseResponse<>(true, "User progress retrieved successfully", progressList));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<BaseResponse<List<UserProgress>>> getUserProgressByCourseId(@PathVariable Long courseId) {
        List<UserProgress> progressList = userProgressService.getUserProgressByCourseId(courseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Course progress retrieved successfully", progressList));
    }

    @GetMapping("/user/{accountId}/course/{courseId}")
    public ResponseEntity<BaseResponse<UserProgress>> getUserProgressByAccountAndCourse(
            @PathVariable Long accountId, @PathVariable Long courseId) {
        Optional<UserProgress> progress = userProgressService.getUserProgressByAccountAndCourse(accountId, courseId);
        return progress.map(p -> ResponseEntity.ok(new BaseResponse<>(true, "Progress retrieved successfully", p)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Progress not found", null)));
    }

    @PostMapping("/start")
    public ResponseEntity<BaseResponse<UserProgress>> startCourse(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.parseLong(payload.get("accountId").toString());
            Long courseId = Long.parseLong(payload.get("courseId").toString());

            UserProgress progress = userProgressService.startCourse(accountId, courseId);

            if (progress != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Course started successfully", progress));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to start course. User or course not found.", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to start course: " + e.getMessage(), null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<BaseResponse<UserProgress>> updateProgress(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.parseLong(payload.get("accountId").toString());
            Long courseId = Long.parseLong(payload.get("courseId").toString());
            Integer correctAnswers = Integer.parseInt(payload.get("correctAnswers").toString());
            Integer totalQuestions = Integer.parseInt(payload.get("totalQuestions").toString());
            Integer lastQuestionIndex = Integer.parseInt(payload.get("lastQuestionIndex").toString());

            UserProgress progress = userProgressService.updateUserProgress(
                accountId, courseId, correctAnswers, totalQuestions, lastQuestionIndex);

            if (progress != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Progress updated successfully", progress));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(false, "Progress not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to update progress: " + e.getMessage(), null));
        }
    }

    @PutMapping("/complete")
    public ResponseEntity<BaseResponse<UserProgress>> completeCourse(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.parseLong(payload.get("accountId").toString());
            Long courseId = Long.parseLong(payload.get("courseId").toString());
            Integer correctAnswers = Integer.parseInt(payload.get("correctAnswers").toString());
            Integer totalQuestions = Integer.parseInt(payload.get("totalQuestions").toString());

            UserProgress progress = userProgressService.completeCourse(
                accountId, courseId, correctAnswers, totalQuestions);

            if (progress != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Course completed successfully", progress));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(false, "Progress, course, or user not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to complete course: " + e.getMessage(), null));
        }
    }

    @GetMapping("/stats/{accountId}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getUserStats(@PathVariable Long accountId) {
        try {
            long completedCourses = userProgressService.getCompletedCoursesCount(accountId);
            Integer totalExp = userProgressService.getTotalExpGained(accountId);

            Map<String, Object> stats = Map.of(
                "completedCourses", completedCourses,
                "totalExp", totalExp
            );

            return ResponseEntity.ok(new BaseResponse<>(true, "User stats retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to retrieve user stats: " + e.getMessage(), null));
        }
    }
}

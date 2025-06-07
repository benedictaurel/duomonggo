package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Difficulty;
import com.benedict.duomonggo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Course>> getCourse(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(value -> ResponseEntity.ok(new BaseResponse<>(true, "Course found", value)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Course not found", null)));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<Course>>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(new BaseResponse<>(true, "Courses found", courses));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<BaseResponse<List<Course>>> getCoursesByDifficulty(@PathVariable String difficulty) {
        try {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
            List<Course> courses = courseService.getCoursesByDifficulty(difficultyEnum);

            if (courses.isEmpty()) {
                return ResponseEntity.ok(new BaseResponse<>(true, "No courses found with this difficulty", courses));
            }

            return ResponseEntity.ok(new BaseResponse<>(true, "Courses found", courses));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(false, "Invalid difficulty value", null));
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Course>> createCourse(@RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            Course course = courseService.createCourse(title, description, difficulty, expReward);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Course created successfully", course));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to create course: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Course>> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            Course course = courseService.updateCourse(id, title, description, difficulty, expReward);

            if (course != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Course updated successfully", course));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Course not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to update course: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<String>> deleteCourse(@PathVariable Long id) {
        try {
            Optional<Course> existingCourse = courseService.getCourseById(id);
            if (existingCourse.isPresent()) {
                courseService.deleteCourse(id);
                return ResponseEntity.ok(new BaseResponse<>(true, "Course deleted successfully",
                        "Course with ID: " + id + " was deleted"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Course not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to delete course: " + e.getMessage(), null));
        }
    }
}

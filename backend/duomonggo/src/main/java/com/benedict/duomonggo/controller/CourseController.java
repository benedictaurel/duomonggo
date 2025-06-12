package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Difficulty;
import com.benedict.duomonggo.model.CourseType;
import com.benedict.duomonggo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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

    @GetMapping("/type/{courseType}")
    public ResponseEntity<BaseResponse<List<Course>>> getCoursesByType(@PathVariable String courseType) {
        try {
            CourseType courseTypeEnum = CourseType.valueOf(courseType.toUpperCase());
            List<Course> courses = courseService.getCoursesByCourseType(courseTypeEnum);

            if (courses.isEmpty()) {
                return ResponseEntity.ok(new BaseResponse<>(true, "No courses found with this type", courses));
            }

            return ResponseEntity.ok(new BaseResponse<>(true, "Courses found", courses));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(false, "Invalid course type value", null));
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Course>> createCourse(@RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            CourseType courseType = CourseType.SINGLEPLAYER;
            if (payload.containsKey("courseType")) {
                courseType = CourseType.valueOf(((String) payload.get("courseType")).toUpperCase());
            }

            Course course = courseService.createCourse(title, description, difficulty, courseType, expReward);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Course created successfully", course));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to create course: " + e.getMessage(), null));
        }
    }

    @PostMapping("/multiplayer")
    public ResponseEntity<BaseResponse<Course>> createMultiplayerCourse(@RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            String deadlineStr = (String) payload.get("deadline");
            if (deadlineStr == null) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(false, "Deadline is required for multiplayer courses", null));
            }

            LocalDateTime deadline;
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
                ZoneId bangkokZone = ZoneId.of("Asia/Bangkok");
                ZonedDateTime zonedDateTime = ZonedDateTime.parse(deadlineStr, formatter.withZone(bangkokZone));
                deadline = zonedDateTime.toLocalDateTime();
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(false, "Invalid deadline format. Use ISO format (YYYY-MM-DDTHH:MM:SS)", null));
            }

            Course course = courseService.createMultiplayerCourse(title, description, difficulty, deadline, expReward);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Multiplayer course created successfully", course));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to create multiplayer course: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Course>> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            Course course;
            if (payload.containsKey("courseType")) {
                CourseType courseType = CourseType.valueOf(((String) payload.get("courseType")).toUpperCase());
                course = courseService.updateCourse(id, title, description, difficulty, courseType, expReward);
            } else {
                course = courseService.updateCourse(id, title, description, difficulty, expReward);
            }

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

    @PutMapping("/multiplayer/{id}")
    public ResponseEntity<BaseResponse<Course>> updateMultiplayerCourse(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            Difficulty difficulty = Difficulty.valueOf(((String) payload.get("difficulty")).toUpperCase());
            Integer expReward = Integer.parseInt(payload.get("expReward").toString());

            String deadlineStr = (String) payload.get("deadline");
            if (deadlineStr == null) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(false, "Deadline is required for multiplayer courses", null));
            }

            LocalDateTime deadline;
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
                // Parse with Bangkok timezone context
                ZoneId bangkokZone = ZoneId.of("Asia/Bangkok");
                ZonedDateTime zonedDateTime = ZonedDateTime.parse(deadlineStr, formatter.withZone(bangkokZone));
                deadline = zonedDateTime.toLocalDateTime();
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse<>(false, "Invalid deadline format. Use ISO format (YYYY-MM-DDTHH:MM:SS)", null));
            }

            Course course = courseService.updateMultiplayerCourse(id, title, description, difficulty, deadline, expReward);

            if (course != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Multiplayer course updated successfully", course));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Course not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(false, "Failed to update multiplayer course: " + e.getMessage(), null));
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

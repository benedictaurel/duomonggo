package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Enrollment;
import com.benedict.duomonggo.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping(value = "/start")
    public ResponseEntity<BaseResponse<Enrollment>> startCourse(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.parseLong(payload.get("accountId").toString());
            Long courseId = Long.parseLong(payload.get("courseId").toString());

            Enrollment enrollment = enrollmentService.startCourse(accountId, courseId);

            return ResponseEntity.ok(new BaseResponse<>(true,
                    "Course enrollment started successfully", enrollment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false,
                            "Failed to start course enrollment: " + e.getMessage(), null));
        }
    }

    @PutMapping(value = "/complete")
    public ResponseEntity<BaseResponse<Enrollment>> completeCourse(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.parseLong(payload.get("accountId").toString());
            Long courseId = Long.parseLong(payload.get("courseId").toString());

            Enrollment enrollment = enrollmentService.completeCourse(accountId, courseId);

            return ResponseEntity.ok(new BaseResponse<>(true,
                    "Course completed successfully", enrollment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false,
                            "Failed to complete course: " + e.getMessage(), null));
        }
    }

    @GetMapping("/is-completed/user/{accountId}/course/{courseId}")
    public ResponseEntity<BaseResponse<Boolean>> isCompleted(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        try {
            boolean isCompleted = enrollmentService.isCompleted(accountId, courseId);

            return ResponseEntity.ok(new BaseResponse<>(true,
                    "Course completion status retrieved successfully", isCompleted));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false,
                            "Failed to get course completion status: " + e.getMessage(), null));
        }
    }
}

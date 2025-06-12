package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Multiplayer;
import com.benedict.duomonggo.service.MultiplayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/multiplayer")
@CrossOrigin(origins = "*")
public class MultiplayerController {

    private final MultiplayerService multiplayerService;

    @Autowired
    public MultiplayerController(MultiplayerService multiplayerService) {
        this.multiplayerService = multiplayerService;
    }

    @PostMapping("/start")
    public ResponseEntity<BaseResponse<Multiplayer>> startCourse(@RequestParam("accountId") Long accountId,
                                                  @RequestParam("courseId") Long courseId) {
        Multiplayer result = multiplayerService.startCourse(accountId, courseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Course started successfully", result));
    }

    @PutMapping("/complete")
    public ResponseEntity<BaseResponse<Multiplayer>> completeCourse(@RequestParam("accountId") Long accountId,
                                                     @RequestParam("courseId") Long courseId) {
        Multiplayer result = multiplayerService.completeCourse(accountId, courseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Course completed successfully", result));
    }

    @GetMapping("/is-completed/user/{accountId}/course/{courseId}")
    public ResponseEntity<BaseResponse<Map<String, Boolean>>> isCompleted(@PathVariable Long accountId, @PathVariable Long courseId) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("completed", multiplayerService.isCompleted(accountId, courseId));
        return ResponseEntity.ok(new BaseResponse<>(true, "Completion status retrieved successfully", result));
    }

    @GetMapping("/time/user/{accountId}/course/{courseId}")
    public ResponseEntity<BaseResponse<Map<String, Long>>> getCompletionTime(@PathVariable Long accountId, @PathVariable Long courseId) {
        Map<String, Long> result = new HashMap<>();
        result.put("completionTime", multiplayerService.getCompletionTimeInSeconds(accountId, courseId));
        return ResponseEntity.ok(new BaseResponse<>(true, "Completion time retrieved successfully", result));
    }

    @GetMapping("/time/course/{courseId}")
    public ResponseEntity<BaseResponse<List<Map<String, Object>>>> getAllCompletionTimesForCourse(@PathVariable Long courseId) {
        List<Map<String, Object>> result = multiplayerService.getAllCompletionTimesForCourse(courseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "All completion times retrieved successfully", result));
    }
}

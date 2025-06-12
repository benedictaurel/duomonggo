package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.CourseType;
import com.benedict.duomonggo.model.Multiplayer;
import com.benedict.duomonggo.repository.AccountRepository;
import com.benedict.duomonggo.repository.CourseRepository;
import com.benedict.duomonggo.repository.MultiplayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MultiplayerService {

    private final MultiplayerRepository multiplayerRepository;
    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public MultiplayerService(MultiplayerRepository multiplayerRepository,
                             AccountRepository accountRepository,
                             CourseRepository courseRepository) {
        this.multiplayerRepository = multiplayerRepository;
        this.accountRepository = accountRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public Multiplayer startCourse(Long accountId, Long courseId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        // Verify this is a multiplayer course
        if (course.getCourseType() != CourseType.MULTIPLAYER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This is not a multiplayer course");
        }

        // Check if there's a deadline and if it's passed
        if (course.getDeadline() != null && LocalDateTime.now().isAfter(course.getDeadline())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course deadline has passed");
        }

        // Check if user already started this course
        if (multiplayerRepository.existsByAccountIdAndCourseId(accountId, courseId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already enrolled in this multiplayer course");
        }

        // Create and save new multiplayer attempt
        Multiplayer multiplayer = new Multiplayer(account, course);
        return multiplayerRepository.save(multiplayer);
    }

    @Transactional
    public Multiplayer completeCourse(Long accountId, Long courseId) {
        Multiplayer multiplayer = multiplayerRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No multiplayer course attempt found for this account and course"));

        if (multiplayer.isCompleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course already completed");
        }

        multiplayer.setCompletedAt(LocalDateTime.now());
        return multiplayerRepository.save(multiplayer);
    }

    public boolean isCompleted(Long accountId, Long courseId) {
        return multiplayerRepository.findByAccountIdAndCourseId(accountId, courseId)
                .map(Multiplayer::isCompleted)
                .orElse(false);
    }

    public Long getCompletionTimeInSeconds(Long accountId, Long courseId) {
        Multiplayer multiplayer = multiplayerRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No multiplayer course attempt found for this account and course"));

        if (!multiplayer.isCompleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not yet completed");
        }

        return multiplayer.getDurationInSeconds();
    }

    public List<Map<String, Object>> getAllCompletionTimesForCourse(Long courseId) {
        // Verify the course exists
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        List<Multiplayer> completedSessions = multiplayerRepository.findByCourseIdAndCompletedAtIsNotNull(courseId);

        return completedSessions.stream()
            .map(multiplayer -> {
                Map<String, Object> result = new HashMap<>();
                result.put("accountId", multiplayer.getAccount().getId());
                result.put("username", multiplayer.getAccount().getUsername());
                result.put("completionTime", multiplayer.getDurationInSeconds());
                result.put("completedAt", multiplayer.getCompletedAt());
                return result;
            })
            .collect(Collectors.toList());
    }
}

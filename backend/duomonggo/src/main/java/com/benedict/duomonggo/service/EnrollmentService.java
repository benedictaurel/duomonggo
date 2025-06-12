package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Enrollment;
import com.benedict.duomonggo.repository.AccountRepository;
import com.benedict.duomonggo.repository.CourseRepository;
import com.benedict.duomonggo.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            AccountRepository accountRepository,
            CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.accountRepository = accountRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment startCourse(Long accountId, Long courseId) {
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
        if (existingEnrollment.isPresent()) {
            return existingEnrollment.get();
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setAccount(account);
        enrollment.setCourse(course);
        enrollment.setIsCompleted(false);

        return enrollmentRepository.save(enrollment);
    }

    public Enrollment completeCourse(Long accountId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getIsCompleted()) {
            enrollment.setIsCompleted(true);

            Account account = enrollment.getAccount();
            Course course = enrollment.getCourse();

            Integer currentExp = account.getExp() != null ? account.getExp() : 0;
            Integer expReward = course.getExpReward() != null ? course.getExpReward() : 0;

            account.setExp(currentExp + expReward);
            accountRepository.save(account);
        }

        return enrollmentRepository.save(enrollment);
    }

    public boolean isCompleted(Long accountId, Long courseId) {
        Optional<Enrollment> enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
        return enrollment.isPresent() && enrollment.get().getIsCompleted();
    }

    public Optional<Enrollment> getEnrollment(Long accountId, Long courseId) {
        return enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId);
    }
}

package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.UserProgress;
import com.benedict.duomonggo.repository.AccountRepository;
import com.benedict.duomonggo.repository.CourseRepository;
import com.benedict.duomonggo.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserProgressService {
    private final UserProgressRepository userProgressRepository;
    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public UserProgressService(UserProgressRepository userProgressRepository,
                              AccountRepository accountRepository,
                              CourseRepository courseRepository) {
        this.userProgressRepository = userProgressRepository;
        this.accountRepository = accountRepository;
        this.courseRepository = courseRepository;
    }

    public List<UserProgress> getAllUserProgress() {
        return userProgressRepository.findAll();
    }

    public List<UserProgress> getUserProgressByAccountId(Long accountId) {
        return userProgressRepository.findByAccountId(accountId);
    }

    public List<UserProgress> getUserProgressByCourseId(Long courseId) {
        return userProgressRepository.findByCourseId(courseId);
    }

    public Optional<UserProgress> getUserProgressByAccountAndCourse(Long accountId, Long courseId) {
        return userProgressRepository.findByAccountIdAndCourseId(accountId, courseId);
    }

    @Transactional
    public UserProgress startCourse(Long accountId, Long courseId) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (accountOptional.isPresent() && courseOptional.isPresent()) {
            Account account = accountOptional.get();
            Course course = courseOptional.get();

            // Check if progress already exists
            Optional<UserProgress> existingProgress = userProgressRepository.findByAccountIdAndCourseId(accountId, courseId);
            if (existingProgress.isPresent()) {
                return existingProgress.get();
            }

            UserProgress userProgress = new UserProgress(account, course);
            return userProgressRepository.save(userProgress);
        }
        return null;
    }

    @Transactional
    public UserProgress updateUserProgress(Long accountId, Long courseId,
                                         Integer correctAnswers, Integer totalQuestions,
                                         Integer lastQuestionIndex) {
        Optional<UserProgress> progressOptional =
            userProgressRepository.findByAccountIdAndCourseId(accountId, courseId);

        if (progressOptional.isPresent()) {
            UserProgress progress = progressOptional.get();
            progress.setCorrectAnswers(correctAnswers);
            progress.setTotalQuestions(totalQuestions);
            progress.setLastQuestionIndex(lastQuestionIndex);
            progress.setUpdatedAt(LocalDateTime.now());
            return userProgressRepository.save(progress);
        }
        return null;
    }

    @Transactional
    public UserProgress completeCourse(Long accountId, Long courseId,
                                     Integer correctAnswers, Integer totalQuestions) {
        Optional<UserProgress> progressOptional =
            userProgressRepository.findByAccountIdAndCourseId(accountId, courseId);
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        Optional<Account> accountOptional = accountRepository.findById(accountId);

        if (progressOptional.isPresent() && courseOptional.isPresent() && accountOptional.isPresent()) {
            UserProgress progress = progressOptional.get();
            Course course = courseOptional.get();
            Account account = accountOptional.get();

            // Only award exp if not already completed
            if (!progress.getCompleted()) {
                progress.setCompleted(true);
                progress.setCorrectAnswers(correctAnswers);
                progress.setTotalQuestions(totalQuestions);

                // Calculate exp based on correctness and course difficulty
                Integer expToGain = calculateExpReward(correctAnswers, totalQuestions, course.getExpReward());
                progress.setExpGained(expToGain);

                // Update user's total exp
                account.setExp(account.getExp() + expToGain);
                accountRepository.save(account);

                progress.setCompletedAt(LocalDateTime.now());
                progress.setUpdatedAt(LocalDateTime.now());
            }

            return userProgressRepository.save(progress);
        }
        return null;
    }

    private Integer calculateExpReward(Integer correctAnswers, Integer totalQuestions, Integer courseExpReward) {
        if (totalQuestions == 0) {
            return 0;
        }

        // Calculate percentage of correct answers
        double correctPercentage = (double) correctAnswers / totalQuestions;

        // Scale the exp reward based on percentage correct
        return (int) Math.round(courseExpReward * correctPercentage);
    }

    public long getCompletedCoursesCount(Long accountId) {
        return userProgressRepository.countCompletedCoursesByAccountId(accountId);
    }

    public Integer getTotalExpGained(Long accountId) {
        Integer totalExp = userProgressRepository.getTotalExpGainedByAccountId(accountId);
        return totalExp == null ? 0 : totalExp;
    }
}

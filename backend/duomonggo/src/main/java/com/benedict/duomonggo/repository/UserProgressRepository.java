package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByAccount(Account account);
    List<UserProgress> findByAccountId(Long accountId);
    List<UserProgress> findByCourseId(Long courseId);
    Optional<UserProgress> findByAccountIdAndCourseId(Long accountId, Long courseId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.account.id = ?1 AND up.completed = true")
    long countCompletedCoursesByAccountId(Long accountId);

    @Query("SELECT SUM(up.expGained) FROM UserProgress up WHERE up.account.id = ?1")
    Integer getTotalExpGainedByAccountId(Long accountId);
}

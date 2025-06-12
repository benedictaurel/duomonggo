package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT e FROM Enrollment e WHERE e.account.id = :accountId AND e.course.id = :courseId")
    Optional<Enrollment> findByAccountIdAndCourseId(@Param("accountId") Long accountId, @Param("courseId") Long courseId);
}

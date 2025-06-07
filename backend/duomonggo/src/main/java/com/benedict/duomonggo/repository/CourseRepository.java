package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDifficulty(Difficulty difficulty);
    List<Course> findByTitleContaining(String title);
}

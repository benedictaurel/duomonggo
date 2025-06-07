package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCourseOrderByOrderNumberAsc(Course course);
    List<Question> findByCourse_IdOrderByOrderNumberAsc(Long courseId);
    long countByCourse_Id(Long courseId);
}

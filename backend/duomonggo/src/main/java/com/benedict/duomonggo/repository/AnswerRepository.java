package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Answer;
import com.benedict.duomonggo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion(Question question);
    List<Answer> findByQuestion_Id(Long questionId);
    void deleteByQuestion_Id(Long questionId);
}

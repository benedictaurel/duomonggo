package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Answer;
import com.benedict.duomonggo.model.Question;
import com.benedict.duomonggo.repository.AnswerRepository;
import com.benedict.duomonggo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public Optional<Answer> getAnswerById(Long id) {
        return answerRepository.findById(id);
    }

    public List<Answer> getAnswersByQuestion(Question question) {
        return answerRepository.findByQuestion(question);
    }

    public List<Answer> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestion_Id(questionId);
    }

    @Transactional
    public Answer createAnswer(String content, Boolean isCorrect, Long questionId) {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();
            Answer answer = new Answer(content, isCorrect, question);
            return answerRepository.save(answer);
        }
        return null;
    }

    @Transactional
    public Answer updateAnswer(Long id, String content, Boolean isCorrect) {
        Optional<Answer> optionalAnswer = answerRepository.findById(id);
        if (optionalAnswer.isPresent()) {
            Answer answer = optionalAnswer.get();
            answer.setContent(content);
            answer.setIsCorrect(isCorrect);
            return answerRepository.save(answer);
        }
        return null;
    }

    @Transactional
    public void deleteAnswer(Long id) {
        answerRepository.deleteById(id);
    }

    @Transactional
    public void deleteAnswersByQuestionId(Long questionId) {
        answerRepository.deleteByQuestion_Id(questionId);
    }
}

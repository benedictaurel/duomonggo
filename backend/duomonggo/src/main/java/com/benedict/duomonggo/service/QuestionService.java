package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Answer;
import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Question;
import com.benedict.duomonggo.model.QuestionType;
import com.benedict.duomonggo.repository.AnswerRepository;
import com.benedict.duomonggo.repository.CourseRepository;
import com.benedict.duomonggo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final AnswerRepository answerRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, CourseRepository courseRepository,
                          AnswerRepository answerRepository, CloudinaryService cloudinaryService) {
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
        this.answerRepository = answerRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public List<Question> getQuestionsByCourse(Course course) {
        return questionRepository.findByCourseOrderByOrderNumberAsc(course);
    }

    public List<Question> getQuestionsByCourseId(Long courseId) {
        return questionRepository.findByCourse_IdOrderByOrderNumberAsc(courseId);
    }

    @Transactional
    public Question createQuestion(String content, QuestionType questionType, String explanation,
                                  Long courseId, Integer orderNumber) {
        return createQuestion(content, questionType, explanation, courseId, orderNumber, null, null);
    }

    @Transactional
    public Question createQuestion(String content, QuestionType questionType, String explanation,
                                  Long courseId, Integer orderNumber, List<Map<String, Object>> choices) {
        return createQuestion(content, questionType, explanation, courseId, orderNumber, choices, null);
    }

    @Transactional
    public Question createQuestion(String content, QuestionType questionType, String explanation,
                                  Long courseId, Integer orderNumber, List<Map<String, Object>> choices,
                                  MultipartFile imageFile) {
        try {
            Optional<Course> courseOptional = courseRepository.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();

                String imageUrl = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                    imageUrl = cloudinaryService.uploadImage(imageFile, "questions");
                }

                Question question = new Question(content, questionType, explanation, course, orderNumber, imageUrl);
                question = questionRepository.save(question);

                if (questionType == QuestionType.MULTIPLE_CHOICE && choices != null && !choices.isEmpty()) {
                    for (Map<String, Object> choiceData : choices) {
                        String choiceContent = (String) choiceData.get("content");
                        Boolean isCorrect = (Boolean) choiceData.get("isCorrect");

                        Answer answer = new Answer(choiceContent, isCorrect, question);
                        question.addAnswer(answer);
                    }

                    question = questionRepository.save(question);
                }

                return question;
            }
            return null;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Question updateQuestion(Long id, String content, QuestionType questionType,
                                  String explanation, Integer orderNumber,
                                  List<Map<String, Object>> choices, MultipartFile imageFile) {
        try {
            Optional<Question> optionalQuestion = questionRepository.findById(id);
            if (optionalQuestion.isPresent()) {
                Question question = optionalQuestion.get();
                question.setContent(content);
                question.setQuestionType(questionType);
                question.setExplanation(explanation);
                question.setOrderNumber(orderNumber);

                if (imageFile != null && !imageFile.isEmpty()) {
//                     cloudinaryService.deleteImage(previousImagePublicId);

                    String imageUrl = cloudinaryService.uploadImage(imageFile, "questions");
                    question.setImageUrl(imageUrl);
                }

                if (questionType == QuestionType.MULTIPLE_CHOICE && choices != null) {
                    answerRepository.deleteByQuestion_Id(question.getId());
                    question.getAnswers().clear();

                    for (Map<String, Object> choiceData : choices) {
                        String choiceContent = (String) choiceData.get("content");
                        Boolean isCorrect = (Boolean) choiceData.get("isCorrect");

                        Answer answer = new Answer(choiceContent, isCorrect, question);
                        question.addAnswer(answer);
                    }
                }

                return questionRepository.save(question);
            }
            return null;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteQuestion(Long id) {
        Optional<Question> question = questionRepository.findById(id);
        question.ifPresent(q -> {
            if (q.getImageUrl() != null) {
//                 cloudinaryService.deleteImage(publicId);
            }
        });

        questionRepository.deleteById(id);
    }
}

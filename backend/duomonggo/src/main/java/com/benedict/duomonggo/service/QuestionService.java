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
        // Call the more comprehensive method with null choices and image
        return createQuestion(content, questionType, explanation, courseId, orderNumber, null, null);
    }

    @Transactional
    public Question createQuestion(String content, QuestionType questionType, String explanation,
                                  Long courseId, Integer orderNumber, List<Map<String, Object>> choices) {
        // Call the more comprehensive method with null image
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

                // Upload image if provided
                String imageUrl = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                    imageUrl = cloudinaryService.uploadImage(imageFile, "questions");
                }

                Question question = new Question(content, questionType, explanation, course, orderNumber, imageUrl);
                question = questionRepository.save(question);

                // If it's a multiple choice question and choices are provided
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
                                  String explanation, Integer orderNumber) {
        // Call the more comprehensive method with null choices and image
        return updateQuestion(id, content, questionType, explanation, orderNumber, null, null);
    }

    @Transactional
    public Question updateQuestion(Long id, String content, QuestionType questionType,
                                  String explanation, Integer orderNumber,
                                  List<Map<String, Object>> choices) {
        // Call the more comprehensive method with null image
        return updateQuestion(id, content, questionType, explanation, orderNumber, choices, null);
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

                // Handle image update if provided
                if (imageFile != null && !imageFile.isEmpty()) {
                    // If there was a previous image, we could delete it here if needed
                    // cloudinaryService.deleteImage(previousImagePublicId);

                    // Upload the new image
                    String imageUrl = cloudinaryService.uploadImage(imageFile, "questions");
                    question.setImageUrl(imageUrl);
                }

                // If it's a multiple choice question and choices are provided
                if (questionType == QuestionType.MULTIPLE_CHOICE && choices != null) {
                    // Clear existing answers for this question
                    answerRepository.deleteByQuestion_Id(question.getId());
                    question.getAnswers().clear();

                    // Add the new choices as answers
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
        // Optionally get the question to delete its image before deleting the question
        Optional<Question> question = questionRepository.findById(id);
        question.ifPresent(q -> {
            if (q.getImageUrl() != null) {
                // Extract public ID from URL and delete from Cloudinary
                // This would require parsing the URL to get the public ID
                // cloudinaryService.deleteImage(publicId);
            }
        });

        questionRepository.deleteById(id);
    }

    public long countQuestionsByCourse(Long courseId) {
        return questionRepository.countByCourse_Id(courseId);
    }
}

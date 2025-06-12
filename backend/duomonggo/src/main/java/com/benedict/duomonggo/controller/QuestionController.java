package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Question;
import com.benedict.duomonggo.model.QuestionType;
import com.benedict.duomonggo.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
public class QuestionController {
    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<Question>>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(new BaseResponse<>(true, "Questions retrieved successfully", questions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Question>> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionService.getQuestionById(id);
        return question.map(q -> ResponseEntity.ok(new BaseResponse<>(true, "Question retrieved successfully", q)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Question not found", null)));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<BaseResponse<List<Question>>> getQuestionsByCourseId(@PathVariable Long courseId) {
        List<Question> questions = questionService.getQuestionsByCourseId(courseId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Questions retrieved successfully", questions));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<BaseResponse<Question>> createQuestion(
            @RequestParam(value = "content") String content,
            @RequestParam(value = "questionType") String questionTypeStr,
            @RequestParam(value = "explanation") String explanation,
            @RequestParam(value = "courseId") Long courseId,
            @RequestParam(value = "orderNumber") Integer orderNumber,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            QuestionType questionType = QuestionType.valueOf(questionTypeStr);
            Question question;

            question = questionService.createQuestion(content, questionType, explanation, courseId, orderNumber, null, image);

            if (question != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Question created successfully", question));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to create question. Course not found.", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to create question: " + e.getMessage(), null));
        }
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<BaseResponse<Question>> updateQuestion(
            @PathVariable Long id,
            @RequestParam("content") String content,
            @RequestParam("questionType") String questionTypeStr,
            @RequestParam("explanation") String explanation,
            @RequestParam("orderNumber") Integer orderNumber,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            QuestionType questionType = QuestionType.valueOf(questionTypeStr);
            Question question;

            question = questionService.updateQuestion(id, content, questionType, explanation, orderNumber, null, image);

            if (question != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Question updated successfully", question));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(false, "Question not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to update question: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok(new BaseResponse<>(true, "Question deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to delete question: " + e.getMessage(), null));
        }
    }
}

package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.Answer;
import com.benedict.duomonggo.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/answers")
public class AnswerController {
    private final AnswerService answerService;

    @Autowired
    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<Answer>>> getAllAnswers() {
        List<Answer> answers = answerService.getAllAnswers();
        return ResponseEntity.ok(new BaseResponse<>(true, "Answers retrieved successfully", answers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Answer>> getAnswerById(@PathVariable Long id) {
        Optional<Answer> answer = answerService.getAnswerById(id);
        return answer.map(a -> ResponseEntity.ok(new BaseResponse<>(true, "Answer retrieved successfully", a)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Answer not found", null)));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<BaseResponse<List<Answer>>> getAnswersByQuestionId(@PathVariable Long questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);
        return ResponseEntity.ok(new BaseResponse<>(true, "Answers retrieved successfully", answers));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Answer>> createAnswer(@RequestBody Map<String, Object> payload) {
        try {
            String content = (String) payload.get("content");
            Boolean isCorrect = (Boolean) payload.get("isCorrect");
            Long questionId = Long.parseLong(payload.get("questionId").toString());

            Answer answer = answerService.createAnswer(content, isCorrect, questionId);

            if (answer != null) {
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Answer created successfully", answer));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to create answer. Question not found.", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to create answer: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Answer>> updateAnswer(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String content = (String) payload.get("content");
            Boolean isCorrect = (Boolean) payload.get("isCorrect");

            Answer answer = answerService.updateAnswer(id, content, isCorrect);

            if (answer != null) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Answer updated successfully", answer));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(false, "Answer not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to update answer: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteAnswer(@PathVariable Long id) {
        try {
            answerService.deleteAnswer(id);
            return ResponseEntity.ok(new BaseResponse<>(true, "Answer deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to delete answer: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<BaseResponse<Void>> deleteAnswersByQuestionId(@PathVariable Long questionId) {
        try {
            answerService.deleteAnswersByQuestionId(questionId);
            return ResponseEntity.ok(new BaseResponse<>(true, "Answers deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new BaseResponse<>(false, "Failed to delete answers: " + e.getMessage(), null));
        }
    }
}

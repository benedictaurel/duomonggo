package com.benedict.duomonggo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
public class UserProgress extends Serializable {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "last_question_index", nullable = false)
    private Integer lastQuestionIndex;

    @Column(name = "exp_gained", nullable = false)
    private Integer expGained;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public UserProgress() {
        this.completed = false;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.lastQuestionIndex = 0;
        this.expGained = 0;
    }

    public UserProgress(Account account, Course course) {
        this.account = account;
        this.course = course;
        this.completed = false;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.lastQuestionIndex = 0;
        this.expGained = 0;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getLastQuestionIndex() {
        return lastQuestionIndex;
    }

    public void setLastQuestionIndex(Integer lastQuestionIndex) {
        this.lastQuestionIndex = lastQuestionIndex;
    }

    public Integer getExpGained() {
        return expGained;
    }

    public void setExpGained(Integer expGained) {
        this.expGained = expGained;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}

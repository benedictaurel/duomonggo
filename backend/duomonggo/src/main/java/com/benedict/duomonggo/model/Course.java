package com.benedict.duomonggo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "courses")
public class Course extends Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(name = "course_type", nullable = false)
    private CourseType courseType;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "exp_reward", nullable = false)
    private Integer expReward;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Multiplayer> multiplayerSessions = new ArrayList<>();

    public Course() {
        this.title = "";
        this.description = "";
        this.difficulty = Difficulty.EASY;
        this.courseType = CourseType.SINGLEPLAYER;
        this.expReward = 0;
    }

    public Course(String title, String description, Difficulty difficulty, CourseType courseType, Integer expReward) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.courseType = courseType;
        this.expReward = expReward;
    }

    public Course(String title, String description, Difficulty difficulty, CourseType courseType, LocalDateTime deadline, Integer expReward) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.courseType = courseType;
        this.deadline = deadline;
        this.expReward = expReward;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public CourseType getCourseType() {
        return courseType;
    }

    public void setCourseType(CourseType courseType) {
        this.courseType = courseType;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Integer getExpReward() {
        return expReward;
    }

    public void setExpReward(Integer expReward) {
        this.expReward = expReward;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public void addQuestion(Question question) {
        questions.add(question);
        question.setCourse(this);
    }

    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setCourse(null);
    }
    
    public List<Enrollment> getEnrollments() {
        return enrollments;
    }
    
    public void setEnrollments(List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }

    @JsonProperty("multiplayerSessionIds")
    public List<Long> getMultiplayerSessionIds() {
        List<Long> ids = new ArrayList<>();
        for (Multiplayer multiplayer : multiplayerSessions) {
            ids.add(multiplayer.getId());
        }
        return ids;
    }

    public List<Multiplayer> getMultiplayerSessions() {
        return multiplayerSessions;
    }

    public void setMultiplayerSessions(List<Multiplayer> multiplayerSessions) {
        this.multiplayerSessions = multiplayerSessions;
    }
}

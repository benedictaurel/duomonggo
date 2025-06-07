package com.benedict.duomonggo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "account")
public class Account extends Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    String username;

    @Column(name = "password", nullable = false)
    String password;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    Role role;

    @Column(name = "exp", nullable = false)
    Integer exp;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProgress> userProgresses = new ArrayList<>();

    public Account() {
        this.username = "";
        this.password = "";
        this.email = "";
        this.role = Role.USER;
        this.exp = 0;
    }

    public Account(String username, String password, String email, Role role, Integer exp) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.exp = exp;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getExp() {
        return exp;
    }

    public void setExp(Integer exp) {
        this.exp = exp;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserProgress> getUserProgresses() {
        return userProgresses;
    }

    public void setUserProgresses(List<UserProgress> userProgresses) {
        this.userProgresses = userProgresses;
    }

    public void addUserProgress(UserProgress userProgress) {
        userProgresses.add(userProgress);
        userProgress.setAccount(this);
    }

    public void removeUserProgress(UserProgress userProgress) {
        userProgresses.remove(userProgress);
        userProgress.setAccount(null);
    }
}

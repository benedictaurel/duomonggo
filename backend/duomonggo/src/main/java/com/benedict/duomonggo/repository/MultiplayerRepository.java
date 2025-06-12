package com.benedict.duomonggo.repository;

import com.benedict.duomonggo.model.Multiplayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MultiplayerRepository extends JpaRepository<Multiplayer, Long> {
    Optional<Multiplayer> findByAccountIdAndCourseId(Long accountId, Long courseId);
    boolean existsByAccountIdAndCourseId(Long accountId, Long courseId);
    List<Multiplayer> findByCourseIdAndCompletedAtIsNotNull(Long courseId);
}

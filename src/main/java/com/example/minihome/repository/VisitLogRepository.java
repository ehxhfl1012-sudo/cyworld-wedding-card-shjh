package com.example.minihome.repository;

import com.example.minihome.entity.VisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {

    long countByVisitedAtBetween(LocalDateTime start, LocalDateTime end);

    long count();
}

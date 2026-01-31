package com.example.minihome.controller;

import com.example.minihome.entity.VisitLog;
import com.example.minihome.repository.VisitLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/visit")
public class VisitController {

    @Autowired
    private VisitLogRepository visitLogRepository;

    /**
     * 방문 기록 (호출 시 1회 카운트)
     */
    @PostMapping
    public ResponseEntity<Map<String, Long>> recordVisit() {
        VisitLog log = new VisitLog();
        visitLogRepository.save(log);

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        long todayCount = visitLogRepository.countByVisitedAtBetween(startOfDay, endOfDay);
        long totalCount = visitLogRepository.count();

        return ResponseEntity.ok(Map.of(
            "today", todayCount,
            "total", totalCount
        ));
    }

    /**
     * 오늘/총 방문 수 조회
     */
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getCounts() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        long todayCount = visitLogRepository.countByVisitedAtBetween(startOfDay, endOfDay);
        long totalCount = visitLogRepository.count();

        return ResponseEntity.ok(Map.of(
            "today", todayCount,
            "total", totalCount
        ));
    }
}

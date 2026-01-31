package com.example.minihome.repository;

import com.example.minihome.entity.DiaryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiaryEventRepository extends JpaRepository<DiaryEvent, Long> {
    List<DiaryEvent> findAllByOrderByEventDateDesc();
    List<DiaryEvent> findAllByOrderByEventDateAsc();
    List<DiaryEvent> findByEventDate(LocalDate eventDate);
    List<DiaryEvent> findByEventDateOrderByCreatedAtAsc(LocalDate eventDate);
    List<DiaryEvent> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    // 오늘 이후의 가장 가까운 일정들 조회
    @Query("SELECT e FROM DiaryEvent e WHERE e.eventDate >= :today ORDER BY e.eventDate ASC, e.createdAt ASC")
    List<DiaryEvent> findUpcomingEvents(@Param("today") LocalDate today);
}

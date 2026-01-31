package com.example.minihome.controller;

import com.example.minihome.entity.DiaryEvent;
import com.example.minihome.repository.DiaryEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/diary")
public class DiaryEventController {
    
    @Autowired
    private DiaryEventRepository diaryEventRepository;
    
    @GetMapping
    public ResponseEntity<List<DiaryEvent>> getAllEvents() {
        return ResponseEntity.ok(diaryEventRepository.findAllByOrderByEventDateDesc());
    }
    
    // 특정 날짜의 모든 일정 조회 (여러 일정 지원)
    @GetMapping("/date/{date}")
    public ResponseEntity<List<DiaryEvent>> getEventsByDate(@PathVariable String date) {
        LocalDate eventDate = LocalDate.parse(date);
        List<DiaryEvent> events = diaryEventRepository.findByEventDateOrderByCreatedAtAsc(eventDate);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<DiaryEvent>> getEventsByMonth(@PathVariable("year") int year, @PathVariable("month") int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return ResponseEntity.ok(diaryEventRepository.findByEventDateBetween(startDate, endDate));
    }
    
    // 오늘 이후 가장 가까운 일정들 조회 (없으면 모든 일정 반환)
    @GetMapping("/upcoming")
    public ResponseEntity<List<DiaryEvent>> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        List<DiaryEvent> events = diaryEventRepository.findUpcomingEvents(today);
        
        // 다가오는 일정이 없으면 모든 일정 반환 (최신순)
        if (events.isEmpty()) {
            events = diaryEventRepository.findAllByOrderByEventDateDesc();
        }
        
        return ResponseEntity.ok(events);
    }
    
    // 최신 일정 조회 (과거 포함)
    @GetMapping("/latest")
    public ResponseEntity<List<DiaryEvent>> getLatestEvents() {
        return ResponseEntity.ok(diaryEventRepository.findAllByOrderByEventDateDesc());
    }
    
    // 특정 일정 조회
    @GetMapping("/{id}")
    public ResponseEntity<DiaryEvent> getEventById(@PathVariable("id") Long id) {
        Optional<DiaryEvent> event = diaryEventRepository.findById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<DiaryEvent> createEvent(@RequestBody Map<String, String> request) {
        String dateStr = request.get("eventDate");
        String title = request.get("title");
        String content = request.get("content");
        
        if (dateStr == null || title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // 200자 제한
        if (title.length() > 200) {
            title = title.substring(0, 200);
        }
        if (content != null && content.length() > 200) {
            content = content.substring(0, 200);
        }
        
        LocalDate eventDate = LocalDate.parse(dateStr);
        
        // 항상 새로운 일정 생성 (여러 일정 지원)
        DiaryEvent event = new DiaryEvent(eventDate, title, content);
        return ResponseEntity.ok(diaryEventRepository.save(event));
    }
    
    // 일정 수정
    @PutMapping("/{id}")
    public ResponseEntity<DiaryEvent> updateEvent(@PathVariable("id") Long id, @RequestBody Map<String, String> request) {
        String title = request.get("title");
        String content = request.get("content");
        
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // 200자 제한
        if (title.length() > 200) {
            title = title.substring(0, 200);
        }
        if (content != null && content.length() > 200) {
            content = content.substring(0, 200);
        }
        
        Optional<DiaryEvent> existing = diaryEventRepository.findById(id);
        if (existing.isPresent()) {
            DiaryEvent event = existing.get();
            event.setTitle(title);
            event.setContent(content);
            return ResponseEntity.ok(diaryEventRepository.save(event));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") Long id) {
        diaryEventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 모든 일정 삭제
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllEvents() {
        diaryEventRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}

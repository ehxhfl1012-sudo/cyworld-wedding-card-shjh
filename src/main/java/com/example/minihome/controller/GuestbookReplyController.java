package com.example.minihome.controller;

import com.example.minihome.entity.GuestbookReply;
import com.example.minihome.repository.GuestbookReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guestbook/reply")
public class GuestbookReplyController {
    
    @Autowired
    private GuestbookReplyRepository guestbookReplyRepository;
    
    @GetMapping("/{guestbookId}")
    public ResponseEntity<List<GuestbookReply>> getReplies(@PathVariable Long guestbookId) {
        return ResponseEntity.ok(guestbookReplyRepository.findByGuestbookIdOrderByCreatedAtAsc(guestbookId));
    }
    
    @PostMapping
    public ResponseEntity<GuestbookReply> createReply(@RequestBody Map<String, String> request) {
        Long guestbookId = Long.parseLong(request.get("guestbookId"));
        String content = request.get("content");
        String author = request.getOrDefault("author", "관리자");
        
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        GuestbookReply reply = new GuestbookReply(guestbookId, content, author);
        return ResponseEntity.ok(guestbookReplyRepository.save(reply));
    }
}

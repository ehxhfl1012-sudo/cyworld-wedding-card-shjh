package com.example.minihome.controller;

import com.example.minihome.entity.Guestbook;
import com.example.minihome.service.GuestbookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guestbook")
public class GuestbookController {
    
    @Autowired
    private GuestbookService guestbookService;
    
    @GetMapping
    public ResponseEntity<List<Guestbook>> getAllGuestbook() {
        return ResponseEntity.ok(guestbookService.getAllGuestbook());
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getGuestbookCount() {
        return ResponseEntity.ok((long) guestbookService.getAllGuestbook().size());
    }
    
    @PostMapping
    public ResponseEntity<Guestbook> createGuestbook(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String guestType = request.get("guestType");
        
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (guestType == null || guestType.trim().isEmpty()) {
            guestType = "minimy";
        }
        
        Guestbook created = guestbookService.createGuestbook(message, guestType);
        return ResponseEntity.ok(created);
    }
}

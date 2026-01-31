package com.example.minihome.controller;

import com.example.minihome.entity.Ilchonpyeong;
import com.example.minihome.service.IlchonpyeongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ilchonpyeong")
public class IlchonpyeongController {
    
    @Autowired
    private IlchonpyeongService ilchonpyeongService;
    
    @GetMapping
    public ResponseEntity<List<Ilchonpyeong>> getAllIlchonpyeong() {
        return ResponseEntity.ok(ilchonpyeongService.getAllIlchonpyeong());
    }
    
    @PostMapping
    public ResponseEntity<Ilchonpyeong> createIlchonpyeong(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String content = request.get("content");
        
        if (name == null || name.trim().isEmpty() || content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Ilchonpyeong created = ilchonpyeongService.createIlchonpyeong(name, content);
        return ResponseEntity.ok(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIlchonpyeong(@PathVariable Long id) {
        ilchonpyeongService.deleteIlchonpyeong(id);
        return ResponseEntity.ok().build();
    }
}

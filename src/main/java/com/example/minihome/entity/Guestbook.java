package com.example.minihome.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guestbook")
public class Guestbook {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 1000)
    private String message;
    
    @Column(nullable = false)
    private String guestType; // "minimy" or "card"
    
    @Column(nullable = false)
    private Integer guestNumber;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public Guestbook() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Guestbook(String message, String guestType, Integer guestNumber) {
        this.message = message;
        this.guestType = guestType;
        this.guestNumber = guestNumber;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getGuestType() {
        return guestType;
    }
    
    public void setGuestType(String guestType) {
        this.guestType = guestType;
    }
    
    public Integer getGuestNumber() {
        return guestNumber;
    }
    
    public void setGuestNumber(Integer guestNumber) {
        this.guestNumber = guestNumber;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

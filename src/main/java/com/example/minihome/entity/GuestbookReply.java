package com.example.minihome.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guestbook_reply")
public class GuestbookReply {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long guestbookId;
    
    @Column(nullable = false, length = 500)
    private String content;
    
    @Column(nullable = false)
    private String author;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public GuestbookReply() {
        this.createdAt = LocalDateTime.now();
    }
    
    public GuestbookReply(Long guestbookId, String content, String author) {
        this.guestbookId = guestbookId;
        this.content = content;
        this.author = author;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getGuestbookId() {
        return guestbookId;
    }
    
    public void setGuestbookId(Long guestbookId) {
        this.guestbookId = guestbookId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

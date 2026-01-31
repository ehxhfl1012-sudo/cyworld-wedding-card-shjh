package com.example.minihome.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bgm_track")
public class BgmTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 업로드 시 사용자가 지정한 파일명(표시용) */
    @Column(nullable = false)
    private String originalFileName;

    /** 디스크에 저장된 파일명 (중복 방지용) */
    @Column(nullable = false, unique = true)
    private String storedFileName;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public BgmTrack() {
        this.uploadedAt = LocalDateTime.now();
    }

    public BgmTrack(String originalFileName, String storedFileName) {
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}

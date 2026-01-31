package com.example.minihome.controller;

import com.example.minihome.entity.BgmTrack;
import com.example.minihome.repository.BgmTrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bgm")
public class BgmController {

    @Value("${bgm.upload-dir:./uploads/bgm}")
    private String uploadDir;

    @Autowired
    private BgmTrackRepository bgmTrackRepository;

    private Path getUploadPath() {
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            throw new RuntimeException("BGM 업로드 디렉터리 생성 실패", e);
        }
        return path;
    }

    /**
     * 업로드한 BGM 목록 (업로드일 기준 최신순)
     */
    @GetMapping
    public ResponseEntity<List<BgmTrackDto>> list() {
        List<BgmTrack> list = bgmTrackRepository.findAllByOrderByUploadedAtDesc();
        List<BgmTrackDto> dtos = list.stream()
                .map(t -> new BgmTrackDto(
                        t.getId(),
                        t.getOriginalFileName(),
                        "/api/bgm/file/" + t.getId(),
                        t.getUploadedAt().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * BGM 파일 스트리밍
     */
    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> serveFile(@PathVariable("id") Long id) {
        BgmTrack track = bgmTrackRepository.findById(id).orElse(null);
        if (track == null) {
            return ResponseEntity.notFound().build();
        }
        Path file = getUploadPath().resolve(track.getStoredFileName());
        if (!Files.exists(file)) {
            return ResponseEntity.notFound().build();
        }
        try {
            Resource resource = new UrlResource(file.toUri());
            String contentType = Files.probeContentType(file);
            if (contentType == null || !contentType.startsWith("audio/")) {
                String fn = track.getStoredFileName().toLowerCase();
                if (fn.endsWith(".mp3")) contentType = "audio/mpeg";
                else if (fn.endsWith(".wav")) contentType = "audio/wav";
                else if (fn.endsWith(".ogg")) contentType = "audio/ogg";
                else contentType = "audio/mpeg";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + track.getOriginalFileName() + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * BGM 업로드 (관리자용)
     */
    @PostMapping("/upload")
    public ResponseEntity<BgmTrackDto> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "audio";
        }
        // 파일명만 사용 (경로 제거, IE 대응)
        int lastSlash = Math.max(originalFilename.lastIndexOf('/'), originalFilename.lastIndexOf('\\'));
        if (lastSlash >= 0) {
            originalFilename = originalFilename.substring(lastSlash + 1);
        }
        // 확장자 유지 (.mp3 등)
        int lastDot = originalFilename.lastIndexOf('.');
        String ext = (lastDot > 0 && lastDot < originalFilename.length() - 1) ? originalFilename.substring(lastDot).toLowerCase() : "";
        if (ext.isEmpty() && file.getContentType() != null && file.getContentType().toLowerCase().contains("mpeg")) {
            ext = ".mp3";
        }
        String storedFileName = UUID.randomUUID().toString() + ext;

        Path root = getUploadPath();
        Path target = root.resolve(storedFileName);
        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }

        BgmTrack track = new BgmTrack(originalFilename, storedFileName);
        track = bgmTrackRepository.save(track);

        BgmTrackDto dto = new BgmTrackDto(
                track.getId(),
                track.getOriginalFileName(),
                "/api/bgm/file/" + track.getId(),
                track.getUploadedAt().toString());
        return ResponseEntity.ok(dto);
    }

    /**
     * BGM 삭제 (관리자용)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable("id") Long id) {
        BgmTrack track = bgmTrackRepository.findById(id).orElse(null);
        if (track == null) {
            return ResponseEntity.notFound().build();
        }
        Path file = getUploadPath().resolve(track.getStoredFileName());
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
        bgmTrackRepository.delete(track);
        return ResponseEntity.ok().build();
    }

    public static class BgmTrackDto {
        private Long id;
        private String title;
        private String url;
        private String uploadedAt;

        public BgmTrackDto(Long id, String title, String url, String uploadedAt) {
            this.id = id;
            this.title = title;
            this.url = url;
            this.uploadedAt = uploadedAt;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getUrl() {
            return url;
        }

        public String getUploadedAt() {
            return uploadedAt;
        }
    }
}

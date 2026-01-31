package com.example.minihome.repository;

import com.example.minihome.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestbookRepository extends JpaRepository<Guestbook, Long> {
    List<Guestbook> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT COALESCE(MAX(g.guestNumber), 0) FROM Guestbook g")
    Integer findMaxGuestNumber();
}

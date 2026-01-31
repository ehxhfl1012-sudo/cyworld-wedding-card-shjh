package com.example.minihome.repository;

import com.example.minihome.entity.GuestbookReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestbookReplyRepository extends JpaRepository<GuestbookReply, Long> {
    List<GuestbookReply> findByGuestbookIdOrderByCreatedAtAsc(Long guestbookId);
}

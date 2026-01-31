package com.example.minihome.service;

import com.example.minihome.entity.Guestbook;
import com.example.minihome.repository.GuestbookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GuestbookService {
    
    @Autowired
    private GuestbookRepository guestbookRepository;
    
    public List<Guestbook> getAllGuestbook() {
        return guestbookRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Integer getNextGuestNumber() {
        Integer maxNumber = guestbookRepository.findMaxGuestNumber();
        return maxNumber == null ? 1 : maxNumber + 1;
    }
    
    @Transactional
    public Guestbook createGuestbook(String message, String guestType) {
        Integer nextNumber = getNextGuestNumber();
        Guestbook guestbook = new Guestbook(message, guestType, nextNumber);
        return guestbookRepository.save(guestbook);
    }
}

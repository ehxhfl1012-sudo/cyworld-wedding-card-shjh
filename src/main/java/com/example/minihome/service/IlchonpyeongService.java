package com.example.minihome.service;

import com.example.minihome.entity.Ilchonpyeong;
import com.example.minihome.repository.IlchonpyeongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IlchonpyeongService {
    
    @Autowired
    private IlchonpyeongRepository ilchonpyeongRepository;
    
    public List<Ilchonpyeong> getAllIlchonpyeong() {
        return ilchonpyeongRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @Transactional
    public Ilchonpyeong createIlchonpyeong(String name, String content) {
        Ilchonpyeong ilchonpyeong = new Ilchonpyeong(name, content);
        return ilchonpyeongRepository.save(ilchonpyeong);
    }
    
    @Transactional
    public void deleteIlchonpyeong(Long id) {
        ilchonpyeongRepository.deleteById(id);
    }
}

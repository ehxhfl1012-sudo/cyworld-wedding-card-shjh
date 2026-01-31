package com.example.minihome.repository;

import com.example.minihome.entity.Ilchonpyeong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IlchonpyeongRepository extends JpaRepository<Ilchonpyeong, Long> {
    List<Ilchonpyeong> findAllByOrderByCreatedAtDesc();
}

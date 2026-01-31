package com.example.minihome.repository;

import com.example.minihome.entity.BgmTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BgmTrackRepository extends JpaRepository<BgmTrack, Long> {

    /** 업로드일 기준 최신순 */
    List<BgmTrack> findAllByOrderByUploadedAtDesc();
}

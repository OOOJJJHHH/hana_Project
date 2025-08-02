package com.example.oneproject.Repository;

import com.example.oneproject.Entity.RoomImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomImagesRepository extends JpaRepository<RoomImages, Long> {

    // 특정 객실의 이미지 목록 조회
    List<RoomImages> findByRoomId(Long roomId);

    void deleteByRoomId(Long roomId);

    Optional<RoomImages> findByImageKey(String imageKey);


}
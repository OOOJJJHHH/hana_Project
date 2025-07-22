package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByClodContentIdAndRoomId(Long clodContentId, Long roomId);

    List<Review> findByUserId(Long userId);

    void deleteByClodContentIdAndRoomIdAndUserId(Long clodContentId, Long roomId, Long userId);
}

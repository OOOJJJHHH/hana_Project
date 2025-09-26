package com.example.oneproject.Repository;

import com.example.oneproject.DTO.RoomReviewSummaryDTO;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Review;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByClodContentIdAndRoomId(Long clodContentId, Long roomId);

    List<Review> findByUserId(Long userId);

    void deleteByClodContentIdAndRoomIdAndUserId(Long clodContentId, Long roomId, Long userId);

    void deleteByUserAndClodContentAndRoom(UserContent user, ClodContent clodContent, Room room);

    @Query("SELECT new com.example.oneproject.DTO.RoomReviewSummaryDTO(" +
            "r.room.id, r.room.roomName, r.room.clodContent.lodName, AVG(r.rating), COUNT(r)) " +
            "FROM Review r " +
            "GROUP BY r.room.id, r.room.roomName, r.room.clodContent.lodName " +
            "ORDER BY AVG(r.rating) DESC")
    List<RoomReviewSummaryDTO> findTop5RoomsByAverageRating();
}

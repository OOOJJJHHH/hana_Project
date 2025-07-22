package com.example.oneproject.Service;

import com.example.oneproject.DTO.ReviewDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;

    public Review createReview(ReviewDTO dto) {
        UserContent user = userRepository.findByUId(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        ClodContent clod = clodRepository.findById(dto.getClodContentId()).orElseThrow();
        Room room = roomRepository.findById(dto.getRoomId()).orElseThrow();

        Review review = Review.builder()
                .user(user)
                .clodContent(clod)
                .room(room)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForRoom(Long clodContentId, Long roomId) {
        return reviewRepository.findByClodContentIdAndRoomId(clodContentId, roomId);
    }

    public List<Review> getReviewsByUser(String userId) {
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return reviewRepository.findByUserId(user.getId());
    }

    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow();
        if (review.getUser().getId() != userId) {
            throw new RuntimeException("삭제 권한 없음");
        }
        reviewRepository.deleteById(reviewId);
    }

    public void deleteAllUserReviews(Long clodContentId, Long roomId, Long userId) {
        reviewRepository.deleteByClodContentIdAndRoomIdAndUserId(clodContentId, roomId, userId);
    }
}

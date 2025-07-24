package com.example.oneproject.Service;

import com.example.oneproject.DTO.ReviewDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.oneproject.Enum.ReservationStatus;


import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public Review createReview(ReviewDTO dto) {
        UserContent user = userRepository.findByUId(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        ClodContent clod = clodRepository.findById(dto.getClodContentId()).orElseThrow();
        Room room = roomRepository.findById(dto.getRoomId()).orElseThrow();

        // 🛑 예약 여부 확인 (완료 상태여야 리뷰 작성 허용)
        boolean hasReservation = reservationRepository.existsByUserAndClodContentAndRoomAndStatus(
                user,
                clod,
                room,
                ReservationStatus.RESERVED  // 또는 COMPLETED, 적절한 상태 사용
        );

        if (!hasReservation) {
            throw new RuntimeException("예약한 사용자만 리뷰를 작성할 수 있습니다.");
        }

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

    @Transactional
    public void updateReview(Long reviewId, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NoSuchElementException("리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getuId().equals(reviewDTO.getUserId())) {
            throw new SecurityException("리뷰 작성자만 수정할 수 있습니다.");
        }

        review.setComment(reviewDTO.getComment());
        review.setRating(reviewDTO.getRating());

        reviewRepository.save(review); // 실제로는 JPA의 변경 감지로 생략 가능
    }

    public List<Review> getReviewsByUser(String userId) {
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return reviewRepository.findByUserId(user.getId());
    }

    public void deleteReview(Long reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow();
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        if (review.getUser().getId() != user.getId()) {
            throw new RuntimeException("삭제 권한 없음");
        }
        reviewRepository.deleteById(reviewId);
    }

    public void deleteAllUserReviews(Long clodContentId, Long roomId, Long userId) {
        reviewRepository.deleteByClodContentIdAndRoomIdAndUserId(clodContentId, roomId, userId);
    }
}

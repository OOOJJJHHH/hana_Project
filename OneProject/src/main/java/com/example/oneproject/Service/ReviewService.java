package com.example.oneproject.Service;

import com.example.oneproject.DTO.ReviewDTO;
import com.example.oneproject.DTO.RoomReviewSummaryDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.oneproject.Enum.ReservationStatus;


import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final S3Service s3Service;

    public Review createReview(ReviewDTO dto) {
        UserContent user = userRepository.findByUId(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        ClodContent clod = clodRepository.findById(dto.getClodContentId()).orElseThrow();
        Room room = roomRepository.findById(dto.getRoomId()).orElseThrow();

        // 예약 존재 여부 확인
        boolean hasAnyReservation = reservationRepository.existsByUserAndClodContentAndRoom(
                user, clod, room
        );

        if (!hasAnyReservation) {
            throw new RuntimeException("예약한 사용자만 리뷰를 작성할 수 있습니다.");
        }

        // 예약 상태가 완료(COMPLETED)인지 확인
        boolean isCompleted = reservationRepository.existsByUserAndClodContentAndRoomAndStatus(
                user, clod, room, ReservationStatus.COMPLETED
        );

        if (!isCompleted) {
            throw new RuntimeException("아직 예약 승인이 되지 않았습니다.");  // ✅ 여기 메시지 변경
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

    public List<RoomReviewSummaryDTO> getTop5RoomsByReviews() {
        List<Object[]> results = reviewRepository.findTopRoomsByAverageRating(PageRequest.of(0, 5));

        return results.stream().map(obj -> {
            Room room = (Room) obj[0];
            double avgRating = obj[1] != null ? (Double) obj[1] : 0.0;
            long reviewCount = obj[2] != null ? (Long) obj[2] : 0L;

            // S3 Presigned URL 변환
            List<String> presignedUrls = room.getRoomImages().stream()
                    .map(img -> s3Service.generatePresignedUrl(img.getImageKey()))
                    .collect(Collectors.toList());

            RoomReviewSummaryDTO dto = new RoomReviewSummaryDTO(
                    room.getId(),
                    room.getRoomName(),
                    room.getClodContent().getLodName(),
                    avgRating,
                    reviewCount
            );

            dto.setRoomImages(presignedUrls);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<RoomReviewSummaryDTO> getAllRoomsWithReviewSummary() {
        List<Room> rooms = roomRepository.findAll(); // 전체 객실 조회

        return rooms.stream().map(room -> {
            // 각 객실 평점과 리뷰 수 계산
            List<Review> reviews = reviewRepository.findByClodContentIdAndRoomId(
                    room.getClodContent().getId(), room.getId());

            double avgRating = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);

            long reviewCount = reviews.size();

            // 이미지 presigned URL
            List<String> presignedUrls = room.getRoomImages().stream()
                    .map(img -> s3Service.generatePresignedUrl(img.getImageKey()))
                    .collect(Collectors.toList());

            RoomReviewSummaryDTO dto = new RoomReviewSummaryDTO(
                    room.getId(),
                    room.getRoomName(),
                    room.getClodContent().getLodName(),
                    avgRating,
                    reviewCount
            );
            dto.setRoomImages(presignedUrls);

            return dto;
        }).collect(Collectors.toList());
    }

}

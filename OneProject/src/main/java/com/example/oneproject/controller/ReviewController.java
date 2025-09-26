package com.example.oneproject.controller;

import com.example.oneproject.DTO.RoomReviewSummaryDTO;
import com.example.oneproject.Service.ReviewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // 상위 5개 객실 리뷰 요약
    @GetMapping("/api/rooms/top5-reviews")
    public List<RoomReviewSummaryDTO> getTop5RoomsByReviews() {
        return reviewService.getTop5RoomsByReviews();
    }
}

package com.example.oneproject.DTO;

import lombok.Data;

@Data
public class ReviewDTO {
    private String userId;
    private Long clodContentId;
    private Long roomId;
    private double rating;
    private String comment;
}

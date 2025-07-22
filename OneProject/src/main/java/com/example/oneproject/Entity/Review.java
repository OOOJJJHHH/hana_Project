package com.example.oneproject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double rating;

    @Column(length = 1000, nullable = false)
    private String comment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 유저 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserContent user;

    // 숙소 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clod_content_id")
    private ClodContent clodContent;

    // 객실 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @PrePersist
    public void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

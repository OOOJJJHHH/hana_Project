package com.example.oneproject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UserContent 와 ManyToOne 관계 (찜한 사용자)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserContent user;

    // ClodContent 와 ManyToOne 관계 (찜한 숙소)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lod_id", nullable = false)
    private ClodContent clodContent;

    // Room 과 ManyToOne 관계 (찜한 방)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    // 찜한 시간
    private LocalDateTime createdAt;

    //이 메서드는 DB에 insert되기 직전 자동 실행
    //createdAt을 현재 시간으로 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

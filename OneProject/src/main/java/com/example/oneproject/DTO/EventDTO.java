package com.example.oneproject.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.example.oneproject.Entity.Event;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    private Long id;             // 이벤트 ID
    private String title;        // 이벤트 제목
    private String description;  // 이벤트 설명
    private String startDate;    // 시작 날짜
    private String endDate;      // 종료 날짜
    private String imageUrl;     // 이미지 URL
    private boolean mainBanner;  // ✅ 메인 배너 여부

    // ✅ Entity → DTO 변환 생성자
    public EventDTO(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.imageUrl = event.getImageUrl();
        this.mainBanner = event.isMainBanner();
    }
}
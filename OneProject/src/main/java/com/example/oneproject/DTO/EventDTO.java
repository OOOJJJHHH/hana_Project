package com.example.oneproject.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String imageUrl;

    // 🔥 모든 필드를 받는 생성자
    public EventDTO(Long id, String title, String description, String startDate, String endDate, String imageUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.imageUrl = imageUrl;
    }

    // 🔥 Event 엔티티를 바로 DTO로 변환하는 생성자 (있으면 편리)
    public EventDTO(com.example.oneproject.Entity.Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.imageUrl = event.getImageUrl();
    }
}

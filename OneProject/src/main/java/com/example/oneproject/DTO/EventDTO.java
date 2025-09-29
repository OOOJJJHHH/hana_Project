package com.example.oneproject.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String imageUrl;
    private boolean mainBanner;  // ✅ 추가

    public EventDTO(com.example.oneproject.Entity.Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.imageUrl = event.getImageUrl();
        this.mainBanner = event.isMainBanner();  // ✅ 매핑
    }
}

package com.example.oneproject.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // 👈 추가
import lombok.AllArgsConstructor; // 👈 Lombok 사용 시 보통 같이 추가

@Getter
@Setter
@NoArgsConstructor // 👈 EventService의 'new EventDTO()' 오류 해결
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String imageUrl; // Presigned URL을 담는 용도

    // (선택 사항) Event 엔티티를 바로 DTO로 변환하는 생성자
    public EventDTO(com.example.oneproject.Entity.Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.imageUrl = event.getImageUrl(); // S3 키를 담고, Service에서 Presigned URL로 변환됨
    }
}
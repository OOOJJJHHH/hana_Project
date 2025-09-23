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


}
package com.example.oneproject.DTO;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class WishListDTO {
    private String lodName;
    private String lodLocation;
    private String roomName;
    private int roomPrice;
    private List<String> roomImages;
}


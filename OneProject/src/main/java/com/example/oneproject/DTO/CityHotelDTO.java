package com.example.oneproject.DTO;

import java.util.List;

// 도시별 숙소 그룹 DTO
public class CityHotelDTO {
    private String cityName; // 도시명
    private List<HotelRoomDTO> hotels; // 해당 도시 내 숙소 리스트

    public CityHotelDTO(String cityName, List<HotelRoomDTO> hotels) {
        this.cityName = cityName;
        this.hotels = hotels;
    }

    // Getter / Setter
    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public List<HotelRoomDTO> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelRoomDTO> hotels) {
        this.hotels = hotels;
    }
}

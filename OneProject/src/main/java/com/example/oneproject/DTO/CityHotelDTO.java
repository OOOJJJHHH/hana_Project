package com.example.oneproject.DTO;

import java.util.List;

// 도시별 숙소 그룹 DTO
public class CityHotelDTO {
    private String cityName;
    private List<HotelDTO> hotels;

    public CityHotelDTO() {
    }

    public CityHotelDTO(String cityName, List<HotelDTO> hotels) {
        this.cityName = cityName;
        this.hotels = hotels;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public List<HotelDTO> getHotels() {
        return hotels;
    }

    public void setHotels(List<HotelDTO> hotels) {
        this.hotels = hotels;
    }
}
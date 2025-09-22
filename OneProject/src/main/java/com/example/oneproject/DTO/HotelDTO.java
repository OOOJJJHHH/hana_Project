package com.example.oneproject.DTO;

import java.util.List;

public class HotelDTO {
    private String lodName;
    private String lodCity;
    private String lodImag; // Presigned URL
    private List<String> roomNames;
    private List<RoomDTO> rooms;

    public HotelDTO() {}

    public HotelDTO(String lodName, String lodCity, String lodImag, List<String> roomNames, List<RoomDTO> rooms) {
        this.lodName = lodName;
        this.lodCity = lodCity;
        this.lodImag = lodImag;
        this.roomNames = roomNames;
        this.rooms = rooms;
    }

    public String getLodName() {
        return lodName;
    }

    public void setLodName(String lodName) {
        this.lodName = lodName;
    }

    public String getLodCity() {
        return lodCity;
    }

    public void setLodCity(String lodCity) {
        this.lodCity = lodCity;
    }

    public String getLodImag() {
        return lodImag;
    }

    public void setLodImag(String lodImag) {
        this.lodImag = lodImag;
    }

    public List<String> getRoomNames() {
        return roomNames;
    }

    public void setRoomNames(List<String> roomNames) {
        this.roomNames = roomNames;
    }

    public List<RoomDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomDTO> rooms) {
        this.rooms = rooms;
    }
}
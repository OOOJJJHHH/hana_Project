package com.example.oneproject.DTO;

// 개별 숙소 + 대표 이미지 DTO
public class HotelRoomDTO {
    private Long roomId;
    private String roomName;
    private String lodName; // 숙소 이름
    private String lodCity; // 도시 이름
    private String lodImag; // 대표 이미지 URL

    public HotelRoomDTO(Long roomId, String roomName, String lodName, String lodCity, String lodImag) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.lodName = lodName;
        this.lodCity = lodCity;
        this.lodImag = lodImag;
    }

    // Getter / Setter
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public String getLodName() { return lodName; }
    public void setLodName(String lodName) { this.lodName = lodName; }
    public String getLodCity() { return lodCity; }
    public void setLodCity(String lodCity) { this.lodCity = lodCity; }
    public String getLodImag() { return lodImag; }
    public void setLodImag(String lodImag) { this.lodImag = lodImag; }
}
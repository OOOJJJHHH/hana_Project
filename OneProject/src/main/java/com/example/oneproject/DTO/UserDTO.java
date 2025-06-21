package com.example.oneproject.DTO;

import jakarta.persistence.Column;

public class UserDTO {

    private String roomName;
    private String price;
    private String roomImag;

    private String uUser;
    private String uFirstName;
    private String uId;

    // 추가된 KakaoLoginRequest 관련 필드
    private String uIdEmail;   // 카카오 이메일
    private String uLastName;  // 성

    // 기본 생성자, 게터/세터

    public UserDTO(String uId, String uFirstName, String uUser) {
        this.uId = uId;
        this.uUser = uUser;
        this.uFirstName = uFirstName;
    }



    public String getuUser() {
        return uUser;
    }

    public void setuUser(String uUser) {
        this.uUser = uUser;
    }

    public String getuFirstName() {
        return uFirstName;
    }

    public void setuFirstName(String uFirstName) {
        this.uFirstName = uFirstName;
    }

    public String getuId() {
        return uId;
    }

    public void setuId(String uId) {
        this.uId = uId;
    }

    public String getroomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getRoomImag() {
        return roomImag;
    }

    public void setRoomImag(String roomImag) {
        this.roomImag = roomImag;
    }

    // === 추가된 게터/세터 ===

    public String getUIdEmail() {
        return uIdEmail;
    }

    public void setUIdEmail(String uIdEmail) {
        this.uIdEmail = uIdEmail;
    }

    public String getULastName() {
        return uLastName;
    }

    public void setULastName(String uLastName) {
        this.uLastName = uLastName;
    }

    // Optional: toString() 메서드도 확장 가능
    @Override
    public String toString() {
        return "UserDTO{" +
                "roomName='" + roomName + '\'' +
                ", price='" + price + '\'' +
                ", roomImag='" + roomImag + '\'' +
                ", uUser='" + uUser + '\'' +
                ", uFirstName='" + uFirstName + '\'' +
                ", uId='" + uId + '\'' +
                ", uIdEmail='" + uIdEmail + '\'' +
                ", uLastName='" + uLastName + '\'' +
                '}';
    }
}

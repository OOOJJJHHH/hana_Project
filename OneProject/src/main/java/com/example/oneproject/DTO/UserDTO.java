package com.example.oneproject.DTO;

import jakarta.persistence.Column;

public class UserDTO {


    private String uUser;
    private String uFirstName;
    private String uId;

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
}

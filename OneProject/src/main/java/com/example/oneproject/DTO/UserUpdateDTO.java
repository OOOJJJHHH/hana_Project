package com.example.oneproject.DTO;

public class UserUpdateDTO {
    private String uId;
    private String uFirstName;
    private String uLastName;
    private String uIdEmail;

    // 기본 생성자, 게터/세터
    public UserUpdateDTO() {

    }

    public String getuId() {
        return uId;
    }

    public void setuId(String uId) {
        this.uId = uId;
    }

    public String getuFirstName() {
        return uFirstName;
    }

    public void setuFirstName(String uFirstName) {
        this.uFirstName = uFirstName;
    }

    public String getuLastName() {
        return uLastName;
    }

    public void setuLastName(String uLastName) {
        this.uLastName = uLastName;
    }

    public String getuIdEmail() {
        return uIdEmail;
    }

    public void setuIdEmail(String uIdEmail) {
        this.uIdEmail = uIdEmail;
    }
}

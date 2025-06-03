package com.example.oneproject.Entity;

import jakarta.persistence.*;

@Entity
public class UserContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String uUser;

    @Column(length = 100, nullable = false)
    private String uLastName;

    @Column(length = 100, nullable = false)
    private String uFirstName;

    @Column(length = 100, nullable = false)
    private String uIdEmail;

    @Column(length = 100, nullable = false)
    private String uId;

    @Column(length = 100, nullable = false)
    private String uPassword;

    // === 추가된 필드 ===

    @Column(length = 100, unique = true)
    private String kakaoId; // 카카오 고유 ID (예: "1234567890")

    // === 기존 getter/setter 유지 ===

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getuUser() {
        return uUser;
    }

    public void setuUser(String uUser) {
        this.uUser = uUser;
    }

    public String getuLastName() {
        return uLastName;
    }

    public void setuLastName(String uLastName) {
        this.uLastName = uLastName;
    }

    public String getuFirstName() {
        return uFirstName;
    }

    public void setuFirstName(String uFirstName) {
        this.uFirstName = uFirstName;
    }

    public String getuIdEmail() {
        return uIdEmail;
    }

    public void setuIdEmail(String uIdEmail) {
        this.uIdEmail = uIdEmail;
    }

    public String getuId() {
        return uId;
    }

    public void setuId(String uId) {
        this.uId = uId;
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword;
    }

    // === 추가된 getter/setter ===

    public String getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }
}

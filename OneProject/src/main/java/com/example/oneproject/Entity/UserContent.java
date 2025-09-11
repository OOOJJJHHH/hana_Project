
package com.example.oneproject.Entity;

import jakarta.persistence.*;

@Entity
public class UserContent {

    @Id  // 기본 키
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;    // 시퀀스, auto_increment

    //유저가 사용자인지 아니면 숙소 올리는 주인인지 구별
    @Column(nullable = false)
    private String uUser;

    @Column(length = 100, nullable = false)
    private String uLastName;

    @Column(length = 100, nullable = false)
    private String uFirstName;

    // 사용자의 이메일
    @Column(length = 100, nullable = false)
    private String uIdEmail;

    //로그인시 사용하는 아이디에 해당
    @Column(length = 100, nullable = false, unique = true)
    private String uId;

    //로그인시 사용하는 비밀번호
    @Column(length = 100, nullable = false)
    private String uPassword;

    // ✅ 프로필 이미지 필드 추가
    private String profileImage;

    private String kakaoId;

    @Column(name = "google_id")
    private String googleId;

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

    // ✅ 프로필 이미지 Getter/Setter
    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String imageUrl) {
        this.profileImage = imageUrl;
    }

    public String getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
}

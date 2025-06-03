package com.example.oneproject.Entity;

import jakarta.persistence.*;

@Entity
public class UserContent {

    @Id  // 기본 키를 나타내는 애너테이션
    @GeneratedValue(strategy= GenerationType.IDENTITY)    // 프로젝트에 연결된 DB의 numbering 전략을 따른다.
    private long id;    // 시퀀스, auto_increment

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
}
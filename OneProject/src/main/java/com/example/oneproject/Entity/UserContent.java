package com.example.oneproject.Entity;

import jakarta.persistence.*;

@Entity
public class UserContent {

    @Id  // 기본 키를 나타내는 애너테이션
    @GeneratedValue(strategy= GenerationType.IDENTITY)    // 프로젝트에 연결된 DB의 numbering 전략을 따른다.
    private long id;    // 시퀀스, auto_increment

    @Column(length = 100, nullable = false)
    private String u_last_Name;

    @Column(length = 100, nullable = false)
    private String u_first_Name;

    @Column(length = 100, nullable = false)
    private String u_idEmail;

    @Column(length = 100, nullable = false)
    private String u_pw;

    @Column(length = 100, nullable = false)
    private String u_gender;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getU_last_Name() {
        return u_last_Name;
    }

    public void setU_last_Name(String u_last_Name) {
        this.u_last_Name = u_last_Name;
    }

    public String getU_first_Name() {
        return u_first_Name;
    }

    public void setU_first_Name(String u_first_Name) {
        this.u_first_Name = u_first_Name;
    }

    public String getU_idEmail() {
        return u_idEmail;
    }

    public void setU_idEmail(String u_idEmail) {
        this.u_idEmail = u_idEmail;
    }

    public String getU_pw() {
        return u_pw;
    }

    public void setU_pw(String u_pw) {
        this.u_pw = u_pw;
    }

    public String getU_gender() {
        return u_gender;
    }

    public void setU_gender(String u_gender) {
        this.u_gender = u_gender;
    }
}
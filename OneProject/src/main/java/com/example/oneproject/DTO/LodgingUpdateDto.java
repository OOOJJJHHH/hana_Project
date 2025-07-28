package com.example.oneproject.DTO;

import java.util.List;

// LodgingUpdateDto.java
public class LodgingUpdateDto {
    private String lodName;
    private String lodCity;
    private String lodLocation;
    private String lodCallNum;

    // Getter/Setter 생략

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

    public String getLodLocation() {
        return lodLocation;
    }

    public void setLodLocation(String lodLocation) {
        this.lodLocation = lodLocation;
    }

    public String getLodCallNum() {
        return lodCallNum;
    }

    public void setLodCallNum(String lodCallNum) {
        this.lodCallNum = lodCallNum;
    }
}

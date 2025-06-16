package com.example.oneproject.DTO;

public class ClodContentDTO {
    private Long id; // long 대신 Long으로 통일하는 것이 객체 필드에서는 더 일반적입니다.
    private String lodOwner;
    private String lodCity;
    private String lodName;
    private String lodLocation;
    private String lodCallNum;
    private String lodImag; // 이미지 URL

    // 기본 생성자 (필수)
    public ClodContentDTO() {
    }

    // 모든 필드를 받는 생성자 (편의용)
    public ClodContentDTO(Long id, String lodOwner, String lodCity, String lodName,
                          String lodLocation, String lodCallNum, String lodImag) {
        this.id = id;
        this.lodOwner = lodOwner;
        this.lodCity = lodCity;
        this.lodName = lodName;
        this.lodLocation = lodLocation;
        this.lodCallNum = lodCallNum;
        this.lodImag = lodImag;
    }


    // Getter 및 Setter 메서드
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLodOwner() {
        return lodOwner;
    }

    public void setLodOwner(String lodOwner) {
        this.lodOwner = lodOwner;
    }

    public String getLodCity() {
        return lodCity;
    }

    public void setLodCity(String lodCity) {
        this.lodCity = lodCity;
    }

    public String getLodName() {
        return lodName;
    }

    public void setLodName(String lodName) {
        this.lodName = lodName;
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

    public String getLodImag() {
        return lodImag;
    }

    public void setLodImag(String lodImag) {
        this.lodImag = lodImag;
    }
}

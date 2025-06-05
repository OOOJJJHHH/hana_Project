package com.example.oneproject.DTO;

public class CityContentDTO {
    private long id;
    private String cityName;
    private String cityDetail;
    private String cityState;
    private String cityImageUrl; // presigned URL

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCityDetail() {
        return cityDetail;
    }

    public void setCityDetail(String cityDetail) {
        this.cityDetail = cityDetail;
    }

    public String getCityState() {
        return cityState;
    }

    public void setCityState(String cityState) {
        this.cityState = cityState;
    }

    public String getCityImageUrl() {
        return cityImageUrl;
    }

    public void setCityImageUrl(String cityImageUrl) {
        this.cityImageUrl = cityImageUrl;
    }
}
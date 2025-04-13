package com.example.oneproject.Service;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Repository.CityReporesitory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

    @Autowired
    private final CityReporesitory cityReporesitory;

    public CityService(CityReporesitory cityReporesitory) {
        this.cityReporesitory = cityReporesitory;
    }

    //도시저장
    public void saveCity(CityContent cityContent) {
        cityReporesitory.save(cityContent);
    }

//    //도시삭제
//    public void delCity(String city_Name) {
//        cityReporesitory.deleteById(city_Name);
//    }

    //도시정보 get
    public List<CityContent> getAllCities() {
        return cityReporesitory.findAll();
    }

    @Transactional  // 트랜잭션을 통해 작업을 처리
    public void updateCityField(String cityName) {
        cityReporesitory.updateSpecificCity_name(cityName);
        cityReporesitory.updateAllExceptSpecificCity_name(cityName);
    }

}


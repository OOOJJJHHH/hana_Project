package com.example.oneproject.Service;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Repository.CityReporesitory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CityService {

    @Autowired
    private final CityReporesitory cityReporesitory;

    @Autowired
    private S3Uploader s3Uploader;

    public CityService(CityReporesitory cityReporesitory) {
        this.cityReporesitory = cityReporesitory;
    }

    //도시저장
    public void saveCity(
            String cityName,
            String cityDetail,
            MultipartFile cityImag,
            String cityState
    ) throws IOException {

        CityContent cityContent = new CityContent();
        cityContent.setCityName(cityName);
        cityContent.setCityDetail(cityDetail);
        cityContent.setCityState(cityState);

        String cityImageKey = s3Uploader.uploadFile("cityUploads", cityImag);
        cityContent.setCityImag(cityImageKey);


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


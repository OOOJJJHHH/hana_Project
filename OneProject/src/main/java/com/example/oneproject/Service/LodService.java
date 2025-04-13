package com.example.oneproject.Service;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.CityReporesitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LodService{

    @Autowired
    private final CLodRepository clodRepository;

    public LodService(CLodRepository clodRepository) {
        this.clodRepository = clodRepository;
    }

    //숙소저장
    public void savelod(ClodContent clodContent) {
        clodRepository.save(clodContent);
    }


    //숙소정보 get
    public List<ClodContent> getAllLods() {
        return clodRepository.findAll();
    }

    //특정 도시이름으로 숙소정보 get
    public List<ClodContent> getCityByName(String city_name) {
        return clodRepository.findByLodCity(city_name);
    }

}

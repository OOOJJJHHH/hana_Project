package com.example.oneproject.Service;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Repository.CLodRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class LodService {

    @Autowired
    private CLodRepository lodRepository; // ✅ CLodRepository로 정확하게 지정

    // 숙소 저장
    public void savelod(ClodContent lod) {
        lodRepository.save(lod);
    }

    // 모든 숙소 가져오기
    public List<ClodContent> getAllLods() {
        return lodRepository.findAll();
    }

    public List<ClodContent> getCityByName(String cityName) {
        return lodRepository.findByLodCity(cityName);
    }
    public List<ClodContent> findByLodCity(String cityName) {
        return lodRepository.findByLodCity(cityName);
    }
}

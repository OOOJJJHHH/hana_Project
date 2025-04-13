package com.example.oneproject.Repository;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.ClodContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CLodRepository extends JpaRepository<ClodContent, Integer> {

    List<ClodContent> findByLodCity(String cityName);

}

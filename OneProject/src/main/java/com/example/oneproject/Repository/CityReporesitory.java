package com.example.oneproject.Repository;

import com.example.oneproject.Entity.CityContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityReporesitory extends JpaRepository<CityContent, Integer> {










    //city의 state를 1로 업데이트하고 나머지는 0으로 업데이트
    // @Modifying 어노테이션을 사용하여 UPDATE 쿼리 실행
    @Modifying
    @Query("UPDATE CityContent c SET c.cityState = '1' WHERE c.cityName = :cityName")
    int updateSpecificCity_name(@Param("cityName") String cityName);
    @Modifying
    @Query("UPDATE CityContent c SET c.cityState = '0' WHERE c.cityName != :cityName")
    int updateAllExceptSpecificCity_name(@Param("cityName") String cityName);

}


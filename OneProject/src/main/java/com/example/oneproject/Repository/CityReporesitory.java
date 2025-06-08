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

}


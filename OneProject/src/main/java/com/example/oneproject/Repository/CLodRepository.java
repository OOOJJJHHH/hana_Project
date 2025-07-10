package com.example.oneproject.Repository;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.ClodContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CLodRepository extends JpaRepository<ClodContent, Long> {

    List<ClodContent> findByLodCity(String lodcity);

    List<ClodContent> findByLodOwner(String uFirstName);

    Optional<ClodContent> findByLodName(String lodName);

    List<ClodContent> findAllByLodCity(String lodCity);

    @Query("SELECT DISTINCT c FROM ClodContent c\n" +
            "    LEFT JOIN FETCH c.rooms r\n" +
            "    LEFT JOIN FETCH r.roomImages\n" +
            "    WHERE c.lodName = :lodName")
    Optional<ClodContent> findByLodNameWithRooms(@Param("lodName") String lodName);
}

package com.example.oneproject.Repository;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.RoomImages;
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

    // 1단계 - 숙소와 객실만 fetch
    @Query("SELECT DISTINCT c FROM ClodContent c LEFT JOIN FETCH c.rooms r WHERE c.lodName = :lodName")
    Optional<ClodContent> findByLodNameWithRooms(@Param("lodName") String lodName);

    // 2단계 - 객실에 연결된 이미지들 별도 조회
    @Query("SELECT ri FROM RoomImages ri WHERE ri.room.id IN :roomIds")
    List<RoomImages> findRoomImagesByRoomIds(@Param("roomIds") List<Long> roomIds);

    @Query("SELECT DISTINCT l FROM ClodContent l " +
            "LEFT JOIN FETCH l.rooms r " +
            "LEFT JOIN FETCH r.roomImages")
    List<ClodContent> findAllWithRoomsAndImages();




}

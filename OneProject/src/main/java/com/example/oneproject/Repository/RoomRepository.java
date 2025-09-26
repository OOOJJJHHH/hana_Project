package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.RoomImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // 숙소(ClodContent)와 방 이름(roomName)으로 특정 방 조회
    Optional<Room> findByRoomNameAndClodContent(String roomName, ClodContent clodContent);

    @Query("SELECT ri FROM RoomImages ri WHERE ri.room.id IN :roomIds")
    List<RoomImages> findByRoomIds(@Param("roomIds") List<Long> roomIds);

    // roomName 컬럼에 검색어가 포함된 Room 조회
    @Query("SELECT r FROM Room r JOIN FETCH r.clodContent c WHERE r.roomName LIKE %:keyword%")
    List<Room> findByRoomNameContaining(@Param("keyword") String keyword);

    // 전체 방 중에서 가격이 낮은 순서대로 상위 6개 가져오기
    @Query("SELECT r FROM Room r ORDER BY r.price ASC")
    List<Room> findTop6ByPrice();

}
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

}
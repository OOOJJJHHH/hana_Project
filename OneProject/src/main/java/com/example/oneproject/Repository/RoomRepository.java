package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // 숙소(ClodContent)와 방 이름(roomName)으로 특정 방 조회
    Optional<Room> findByRoomNameAndClodContent(String roomName, ClodContent clodContent);

}
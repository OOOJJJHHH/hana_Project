package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.RoomImages;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT r as room, AVG(rv.rating) as avgRating, COUNT(rv) as reviewCount " +
            "FROM Room r LEFT JOIN r.reviews rv " +
            "GROUP BY r " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRoomsByAverageRating(Pageable pageable);

    // ✅ [성능 개선] 1. 전체 방의 개수를 빠르게 세는 쿼리
    @Query("SELECT COUNT(r.id) FROM Room r")
    long countAllRooms();

    // ✅ [성능 개선] 2. 특정 OFFSET부터 LIMIT 개수만큼 가져오는 쿼리
    // RoomService에서 무작위 OFFSET을 계산해 호출합니다.
    @Query(value = "SELECT * FROM room LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Room> findRoomsWithOffset(@Param("limit") int limit, @Param("offset") int offset);
}


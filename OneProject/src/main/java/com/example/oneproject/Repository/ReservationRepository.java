package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Reservation;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Enum.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status != com.example.oneproject.Enum.ReservationStatus.CANCELED")
    List<Reservation> findConfirmedByRoom(@Param("roomId") Long roomId);

    // 사용자가 특정 숙소(clod)와 방(room)을 예약한 적이 있는지 확인
    boolean existsByUserAndClodContentAndRoomAndStatus(
            UserContent user,
            ClodContent clodContent,
            Room room,
            ReservationStatus status
    );

    boolean existsByUserAndClodContentAndRoom(UserContent user, ClodContent clod, Room room);


    List<Reservation> findByUser_UId(String uId);

    // 숙소 ID 목록과 예약 상태를 기준으로 예약 조회
    List<Reservation> findByClodContentIdInAndStatusIn(List<Long> lodgingIds, List<ReservationStatus> statuses);

    void deleteAllByUser(UserContent user);
}
package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status != com.example.oneproject.Enum.ReservationStatus.CANCELED")
    List<Reservation> findConfirmedByRoom(@Param("roomId") Long roomId);


}

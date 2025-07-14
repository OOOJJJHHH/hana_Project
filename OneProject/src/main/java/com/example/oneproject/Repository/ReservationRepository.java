package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // 필요에 따라 커스텀 쿼리 메서드를 여기에 추가할 수 있습니다.
}

package com.example.oneproject.Service;


import com.example.oneproject.DTO.ReservationRequestDTO;
import com.example.oneproject.DTO.ReservationResponseDTO;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Reservation;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Enum.ReservationStatus;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.ReservationRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public ReservationService(UserRepository userRepository, CLodRepository clodRepository, RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.clodRepository = clodRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    // 예약 되어있는 날짜 확인 후 날짜 데이터 반환
    // 예약 겹치게 하지 않기 위해서
    public List<Reservation> getReservedDatesByRoom(Long roomId) {
        return reservationRepository.findConfirmedByRoom(roomId);
    }

    //예약 등록
    public Reservation createReservation(ReservationRequestDTO dto) {
        UserContent user = userRepository.findByUId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        ClodContent lodging = clodRepository.findById(dto.getClodContentId())
                .orElseThrow(() -> new IllegalArgumentException("숙소가 존재하지 않습니다."));
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("객실이 존재하지 않습니다."));

        Reservation reservation = new Reservation(
                user,
                lodging,
                room,
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getNights(),
                dto.getMemo(),
                dto.isPaid(),
                dto.getStatus()
        );

        return reservationRepository.save(reservation);
    }

    // ============================================================
    // 특정 숙소 주인의 예약 목록 중 PENDING 상태인 것만 조회
    public List<ReservationResponseDTO> findPendingReservationsByLodOwner(String lodOwnerId) {
        List<Reservation> reservations = reservationRepository.findByClodContent_LodOwnerAndStatus(
                lodOwnerId, ReservationStatus.PENDING);

        return reservations.stream()
                .map(ReservationResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 예약 수락 처리
    public void approveReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));
        reservation.setStatus(ReservationStatus.APPROVED);
        reservationRepository.save(reservation);
    }

    // 예약 거절 처리
    public void rejectReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));
        reservation.setStatus(ReservationStatus.REJECTED);
        reservationRepository.save(reservation);
    }
}

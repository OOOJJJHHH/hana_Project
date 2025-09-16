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
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    // 예약 삭제
    @Transactional
    public void deleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("해당 예약을 찾을 수 없습니다. id=" + reservationId));

        reservationRepository.delete(reservation);
    }

    //=============================================================
    // 사용자 ID로 예약 내역 조회
    public List<ReservationResponseDTO> getReservationsByUserUId(String uId) {
        List<Reservation> reservations = reservationRepository.findByUser_UId(uId);
        return reservations.stream()
                .map(ReservationResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 사용자 예약 상태 업데이트
    public void updateReservationStatus(Long reservationId, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        reservation.setStatus(status);
        reservationRepository.save(reservation);
    }

    // ============================================================
    // 특정 숙소 주인의 예약 목록 중 PENDING 상태인 것만 조회
    public List<ReservationResponseDTO> findPendingReservationsByUId(String uId) {
        System.out.println("=========================================");
        System.out.println("🔍 [예약 조회 요청] lodOwner uId: " + uId);
        System.out.println("=========================================");

        // 1. uId로 유저 조회
        UserContent user = userRepository.findByUId(uId)
                .orElseThrow(() -> {
                    System.out.println("❌ 사용자를 찾을 수 없음 - uId: " + uId);
                    return new IllegalArgumentException("해당 uId로 사용자를 찾을 수 없습니다: " + uId);
                });

        String uFirstName = user.getuFirstName();
        System.out.println("✅ 사용자 조회 완료 - uFirstName: " + uFirstName);

        // 2. uFirstName 으로 ClodContent 조회
        List<ClodContent> clods = clodRepository.findByLodOwner(uFirstName);
        System.out.println("🏠 사용자가 올린 숙소 수: " + clods.size());

        List<Long> lodgingIds = clods.stream()
                .map(ClodContent::getId)
                .collect(Collectors.toList());

        System.out.println("📦 숙소 ID 목록: " + lodgingIds);

        if (lodgingIds.isEmpty()) {
            System.out.println("⚠️ 등록된 숙소가 없어 예약 목록이 없습니다.");
            return new ArrayList<>();
        }

        // 3. 예약 상태가 PENDING인 예약만 조회
        List<Reservation> reservations = reservationRepository.findByClodContentIdInAndStatus(
                lodgingIds, ReservationStatus.PENDING
        );

        System.out.println("📋 조회된 PENDING 예약 수: " + reservations.size());
        System.out.println("=========================================");

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

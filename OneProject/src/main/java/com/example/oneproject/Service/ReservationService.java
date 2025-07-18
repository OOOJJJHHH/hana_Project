package com.example.oneproject.Service;

import com.example.oneproject.DTO.ReservationRequestDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.ReservationRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

    public Reservation createReservation(ReservationRequestDTO dto) {
        UserContent user = userRepository.findById(dto.getUserId())
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
}

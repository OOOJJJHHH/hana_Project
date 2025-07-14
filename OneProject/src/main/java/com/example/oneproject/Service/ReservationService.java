package com.example.oneproject.Service;

import com.example.oneproject.Entity.*;
import com.example.oneproject.Enum.ReservationStatus;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.ReservationRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.dto.ReservationRequestDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReservationService {

    private final UserRepository userRepository;
    private final CLodRepository lodRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public ReservationService(UserRepository userRepository,
                              CLodRepository lodRepository,
                              RoomRepository roomRepository,
                              ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.lodRepository = lodRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    public Reservation saveReservation(ReservationRequestDto dto) {
        UserContent user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ClodContent lodging = lodRepository.findById(dto.getLodgingId())
                .orElseThrow(() -> new RuntimeException("숙소를 찾을 수 없습니다."));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("객실을 찾을 수 없습니다."));

        Reservation reservation = new Reservation(
                user,
                lodging,
                room,
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getNights(),
                dto.getMemo(),
                dto.isPaid(),
                ReservationStatus.RESERVED
        );

        return reservationRepository.save(reservation);
    }
}

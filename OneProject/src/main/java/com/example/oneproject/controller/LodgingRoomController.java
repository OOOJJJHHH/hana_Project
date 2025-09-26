package com.example.oneproject.controller;


import com.example.oneproject.DTO.CheapestRoomWithImagesDTO;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class LodgingRoomController {

    @Autowired
    private RoomService roomService;

    // 가장 저렴한 6개 객실 조회
    @GetMapping("/cheapest-top6")
    public List<CheapestRoomWithImagesDTO> getTop6CheapestRooms() {
        return roomService.getTop6CheapestRooms();
    }
}

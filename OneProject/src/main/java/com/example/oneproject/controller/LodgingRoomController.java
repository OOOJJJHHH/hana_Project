package com.example.oneproject.controller;


import com.example.oneproject.DTO.CheapestRoomWithImagesDTO;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LodgingRoomController {

    @Autowired
    private RoomService roomService;

    // 별점 순으로 출력(메인 페이지에서 활용)
    @GetMapping("/cheapest-top6")
    public List<CheapestRoomWithImagesDTO> getTop6CheapestRooms() {
        return roomService.getTop6CheapestRooms();
    }

}

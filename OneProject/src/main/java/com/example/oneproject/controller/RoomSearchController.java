package com.example.oneproject.controller;

import com.example.oneproject.DTO.CityHotelDTO;
import com.example.oneproject.Service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class RoomSearchController {

    private final RoomService roomService;

    public RoomSearchController(RoomService roomService) {
        this.roomService = roomService;
    }

    // GET /api/hotels/search?query=검색어
    @GetMapping("/search")
    public List<CityHotelDTO> searchHotels(@RequestParam String query) {
        return roomService.searchRoomsByKeyword(query);
    }
}

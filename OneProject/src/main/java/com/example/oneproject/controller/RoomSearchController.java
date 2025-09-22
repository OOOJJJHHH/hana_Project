package com.example.oneproject.controller;

import com.example.oneproject.DTO.CityHotelDTO;
import com.example.oneproject.Service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoomSearchController {

    private final RoomService roomService;

    public RoomSearchController(RoomService roomService) {
        this.roomService = roomService;
    }

    // GET /api/hotels/search?query=검색어
    @GetMapping("/api/hotels/search")
    public List<CityHotelDTO> searchHotels(@RequestParam("query") String query) {
        return roomService.searchHotelsByName(query);
    }
}

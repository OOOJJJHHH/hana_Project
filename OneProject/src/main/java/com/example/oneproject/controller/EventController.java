package com.example.oneproject.controller;

import com.example.oneproject.DTO.EventDTO;
import com.example.oneproject.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
public class EventController {

    @Autowired
    private EventService eventService;

    // 1. 이벤트 저장 (POST)
    @PostMapping("/saveEvent")
    public ResponseEntity<String> saveEvent(
            @RequestParam("eventTitle") String eventTitle,
            @RequestParam("eventDescription") String eventDescription,
            @RequestParam("eventStartDate") String eventStartDate,
            @RequestParam("eventEndDate") String eventEndDate,
            @RequestParam(value = "eventImage", required = false) MultipartFile eventImage
    ) {
        try {
            eventService.saveEvent(
                    eventTitle,
                    eventDescription,
                    eventStartDate,
                    eventEndDate,
                    eventImage
            );
            return ResponseEntity.ok("저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("저장 실패: " + e.getMessage());
        }
    }

    // 2. 전체 이벤트 조회 (GET)
    @GetMapping("/getEvents")
    public ResponseEntity<List<EventDTO>> getEvents() {
        try {
            List<EventDTO> allEvents = eventService.getAllEvents();
            return ResponseEntity.ok(allEvents);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // 3. 제목으로 이벤트 단건 조회 (GET)
    @GetMapping("/getEventByTitle/{title}")
    public ResponseEntity<EventDTO> getEventByTitle(@PathVariable String title) {
        try {
            String decodedTitle = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
            EventDTO eventDTO = eventService.getEventDTOByTitle(decodedTitle);

            if (eventDTO != null) {
                return ResponseEntity.ok(eventDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. 제목으로 이벤트 삭제 (DELETE)
    @DeleteMapping("/deleteEventByTitle/{title}")
    public ResponseEntity<String> deleteEventByTitle(@PathVariable String title) {
        try {
            String decodedTitle = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
            boolean success = eventService.deleteEventByTitle(decodedTitle);

            if (success) {
                return ResponseEntity.ok("삭제 완료");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 제목의 이벤트가 없습니다.");
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("잘못된 제목 인코딩입니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
        }
    }

    // 5. 메인배너 토글 (PUT)
    @PutMapping("/updateMainBanner/{title}")
    public ResponseEntity<EventDTO> updateMainBanner(
            @PathVariable String title,
            @RequestBody Map<String, Boolean> bannerMap
    ) {
        try {
            String decodedTitle = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
            Boolean mainBanner = bannerMap.get("mainBanner");
            EventDTO updatedEvent = eventService.updateMainBanner(decodedTitle, mainBanner);

            if (updatedEvent != null) {
                return ResponseEntity.ok(updatedEvent);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 6. 메인배너용 이벤트만 조회 (GET)
    @GetMapping("/getMainBannerEvents")
    public ResponseEntity<List<EventDTO>> getMainBannerEvents() {
        try {
            List<EventDTO> bannerEvents = eventService.getMainBannerEvents();
            return ResponseEntity.ok(bannerEvents);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
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

@RestController
public class EventController {

    @Autowired
    private EventService eventService;

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
            // S3 Presigned URL 생성 실패 등 Service 로직에서 오류 발생 시 500 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    // 3. 제목으로 이벤트 단건 조회 (GET)
    @GetMapping("/getEventByTitle/{title}")
    public ResponseEntity<EventDTO> getEventByTitle(@PathVariable String title) {
        try {
            // URL 디코딩
            String decodedTitle = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
            EventDTO eventDTO = eventService.getEventDTOByTitle(decodedTitle); // Service 메서드 이름 변경 필요

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
            // URL 디코딩
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


}

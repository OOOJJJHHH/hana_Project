package com.example.oneproject.Service;

import com.example.oneproject.Entity.Event;
import com.example.oneproject.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.oneproject.DTO.EventDTO;

import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final S3Uploader s3Uploader; // S3 업로드 서비스 (가정)
    private final S3Service s3Service; // S3 Presigned URL 생성 서비스 (가정)

    // ✅ 이벤트 저장 (EventAdd.js 연동)
    public void saveEvent(String title, String description, String startDate, String endDate, MultipartFile imageFile)
            throws IOException {

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = s3Uploader.uploadFile("eventImages", imageFile);
        }

        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setImageUrl(imageUrl);
        // mainBanner는 기본값 false로 저장됨

        eventRepository.save(event);
    }

    // ✅ 전체 이벤트 조회 (About.jsx 연동)
    public List<EventDTO> getAllEvents() {
        List<Event> eventsFromDB = eventRepository.findAll();

        return eventsFromDB.stream()
                .map(eventEntity -> {
                    String finalImageUrl = null;
                    if (eventEntity.getImageUrl() != null) {
                        finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());
                    }

                    EventDTO eventDTO = new EventDTO();
                    eventDTO.setId(eventEntity.getId());
                    eventDTO.setTitle(eventEntity.getTitle());
                    eventDTO.setDescription(eventEntity.getDescription());
                    eventDTO.setStartDate(eventEntity.getStartDate());
                    eventDTO.setEndDate(eventEntity.getEndDate());
                    eventDTO.setImageUrl(finalImageUrl);
                    eventDTO.setMainBanner(eventEntity.isMainBanner());

                    return eventDTO;
                })
                .collect(Collectors.toList());
    }

    // ✅ 제목으로 이벤트 단건 조회 (EventDetail.js 연동) - [중요] mainBanner 값 확실히 포함
    public EventDTO getEventDTOByTitle(String title) {
        Event event = eventRepository.findByTitle(title);

        if (event == null) return null;

        // DTO로 변환하면서 S3 URL 처리
        String finalImageUrl = null;
        if (event.getImageUrl() != null) {
            finalImageUrl = s3Service.generatePresignedUrl(event.getImageUrl());
        }

        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setImageUrl(finalImageUrl);
        eventDTO.setMainBanner(event.isMainBanner()); // ⭐ DB에 저장된 mainBanner 값 설정

        return eventDTO;
    }

    // ✅ 제목으로 이벤트 삭제
    public boolean deleteEventByTitle(String title) {
        Event event = eventRepository.findByTitle(title);

        if (event != null) {
            // S3 이미지 삭제 로직 (가정)
            String imageUrl = event.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                try {
                    s3Uploader.deleteFile(imageUrl);
                } catch (Exception e) {
                    System.err.println("S3 이미지 삭제 실패 (Key: " + imageUrl + "): " + e.getMessage());
                }
            }
            // DB에서 엔티티 삭제
            eventRepository.delete(event);
            return true;
        } else {
            return false;
        }
    }


    // ✅ 메인 배너 토글 및 단일 배너 강제 로직
    public EventDTO updateMainBanner(String title, Boolean mainBanner) {
        Event event = eventRepository.findByTitle(title);
        if(event == null) return null;



        event.setMainBanner(mainBanner); // true/false 저장
        eventRepository.save(event); // 변경된 이벤트 저장

        // DTO 반환
        EventDTO dto = new EventDTO(event);

        // DTO에 Presigned URL을 설정
        String finalImageUrl = null;
        if (event.getImageUrl() != null) {
            finalImageUrl = s3Service.generatePresignedUrl(event.getImageUrl());
        }
        dto.setImageUrl(finalImageUrl);

        return dto;
    }

    // ✅ 메인 배너용 이벤트만 조회
    public List<EventDTO> getMainBannerEvents() {
        // Calls the repository method to fetch events where mainBanner is true
        List<Event> bannerEvents = eventRepository.findByMainBannerTrue();

        // Converts the list of Event entities to a list of EventDTOs
        return bannerEvents.stream()
                .map(eventEntity -> {
                    String finalImageUrl = null;
                    if (eventEntity.getImageUrl() != null) {
                        finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());
                    }

                    EventDTO eventDTO = new EventDTO();
                    eventDTO.setId(eventEntity.getId());
                    eventDTO.setTitle(eventEntity.getTitle());
                    eventDTO.setDescription(eventEntity.getDescription());
                    eventDTO.setStartDate(eventEntity.getStartDate());
                    eventDTO.setEndDate(eventEntity.getEndDate());
                    eventDTO.setImageUrl(finalImageUrl);
                    eventDTO.setMainBanner(eventEntity.isMainBanner());

                    return eventDTO;
                })
                .collect(Collectors.toList());
    }
}
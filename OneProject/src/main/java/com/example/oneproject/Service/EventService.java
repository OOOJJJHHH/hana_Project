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
    private final S3Uploader s3Uploader; // S3 업로드 서비스
    private final S3Service s3Service; // S3 Presigned URL 생성 서비스

    // ✅ 이벤트 저장 (EventAdd.js 연동)
    public void saveEvent(String title, String description, String startDate, String endDate, MultipartFile imageFile)
            throws IOException {

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // 이미지를 S3에 업로드하고 S3 키(Key)를 받음
            imageUrl = s3Uploader.uploadFile("eventImages", imageFile);
        }

        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setImageUrl(imageUrl);

        eventRepository.save(event);
    }

    // ✅ 전체 이벤트 조회 (About.jsx 연동)
    public List<EventDTO> getAllEvents() {
        List<Event> eventsFromDB = eventRepository.findAll();

        return eventsFromDB.stream()
                .map(eventEntity -> {
                    String finalImageUrl = null;
                    if (eventEntity.getImageUrl() != null) {
                        // S3 키를 임시 접근 가능한 Presigned URL로 변환하여 DTO에 담음
                        finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());
                    }

                    // EventDTO의 기본 생성자 (EventDTO.java에서 추가됨)를 사용
                    EventDTO eventDTO = new EventDTO();
                    eventDTO.setId(eventEntity.getId());
                    eventDTO.setTitle(eventEntity.getTitle());
                    eventDTO.setDescription(eventEntity.getDescription());
                    eventDTO.setStartDate(eventEntity.getStartDate());
                    eventDTO.setEndDate(eventEntity.getEndDate());
                    eventDTO.setImageUrl(finalImageUrl);
                    eventDTO.setMainBanner(eventEntity.isMainBanner()); // ✅ mainBanner 값 추가

                    return eventDTO;
                })
                .collect(Collectors.toList());
    }

    // ✅ 제목으로 이벤트 단건 조회 (EventDetail.js 연동)
    public EventDTO getEventDTOByTitle(String title) {
        Event event = eventRepository.findByTitle(title);

        if (event == null) return null;

        // DTO로 변환하면서 S3 URL 처리
        String finalImageUrl = null;
        if (event.getImageUrl() != null) {
            finalImageUrl = s3Service.generatePresignedUrl(event.getImageUrl());
        }

        // EventDTO의 기본 생성자 (EventDTO.java에서 추가됨)를 사용
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setImageUrl(finalImageUrl);
        eventDTO.setMainBanner(event.isMainBanner()); // ✅ mainBanner 값 추가

        return eventDTO;
    }

    // ✅ ID로 이벤트 삭제 (About.jsx에서 호출됨)
    // ✅ 제목으로 이벤트 삭제 (About.jsx, EventDetail.js 연동)
    public boolean deleteEventByTitle(String title) {
        // 1. 제목으로 이벤트 엔티티 조회
        Event event = eventRepository.findByTitle(title); //

        if (event != null) {
            // 💡 누락된 S3 이미지 삭제 로직 추가 💡
            String imageUrl = event.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                // imageUrl에는 S3 key(경로)가 저장되어 있음.
                // S3Uploader 서비스의 deleteFile 메소드를 사용하여 S3에서 파일을 삭제합니다.
                try {
                    s3Uploader.deleteFile(imageUrl);
                } catch (Exception e) {
                    // S3 삭제가 실패해도 DB 삭제를 계속 진행할지 결정해야 합니다.
                    // 여기서는 로그를 남기고 DB 삭제를 진행하도록 처리합니다.
                    System.err.println("S3 이미지 삭제 실패 (Key: " + imageUrl + "): " + e.getMessage());
                    // 오류를 throw하지 않고 진행합니다.
                }
            }

            // 2. DB에서 엔티티 삭제
            eventRepository.delete(event); //
            return true;
        } else {
            return false; // 해당 제목의 이벤트가 DB에 없음
        }
    }


    // ✅ 메인 배너 토글 및 단일 배너 강제 로직 추가
    public EventDTO updateMainBanner(String title, Boolean mainBanner) {
        Event event = eventRepository.findByTitle(title);
        if(event == null) return null;

        if (mainBanner) {
            // 1. 현재 이벤트를 'true'로 설정하려고 할 때만,
            // 다른 모든 이벤트를 'false'로 초기화하여 단일 배너를 강제합니다.
            // 만약 'false'로 설정하려는 경우 (배너 해제)는 전체 초기화를 수행하지 않습니다.
            eventRepository.resetMainBanners();
        }

        event.setMainBanner(mainBanner); // true/false 저장
        eventRepository.save(event); // 변경된 이벤트 저장

        // DTO 반환
        EventDTO dto = new EventDTO(event);

        // DTO에 Presigned URL을 설정해야 프론트엔드에서 바로 사용할 수 있으므로 추가합니다.
        String finalImageUrl = null;
        if (event.getImageUrl() != null) {
            finalImageUrl = s3Service.generatePresignedUrl(event.getImageUrl());
        }
        dto.setImageUrl(finalImageUrl);

        return dto;
    }

    // ✅ 메인 배너용 이벤트만 조회
    public List<EventDTO> getMainBannerEvents() {
        List<Event> bannerEvents = eventRepository.findByMainBannerTrue();

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
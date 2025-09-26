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

        return eventDTO;
    }

    // ✅ 제목으로 이벤트 삭제 (About.jsx, EventDetail.js 연동)
    public boolean deleteEventByTitle(String title) {
        Event event = eventRepository.findByTitle(title);
        if (event != null) {
            // (선택 사항) S3Uploader를 사용하여 S3의 이미지도 삭제하는 로직을 추가할 수 있습니다.
            // s3Uploader.deleteFile(event.getImageUrl());

            eventRepository.delete(event);
            return true;
        }
        return false;
    }
}
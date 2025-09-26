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
    private final S3Uploader s3Uploader;
    private final S3Service s3Service;

    // ✅ 이벤트 저장
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

        eventRepository.save(event);
    }

    // ✅ 전체 이벤트 조회
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

                    return eventDTO;
                })
                .collect(Collectors.toList());
    }

    // ✅ 제목으로 이벤트 단건 조회
    public Event getEventByTitle(String title) {
        return eventRepository.findByTitle(title);
    }

    // ✅ 제목으로 이벤트 삭제
    public boolean deleteEventByTitle(String title) {
        Event event = eventRepository.findByTitle(title);
        if (event != null) {
            eventRepository.delete(event);
            return true;
        }
        return false;
    }
}

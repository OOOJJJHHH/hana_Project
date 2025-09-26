package com.example.oneproject.Service;

import com.example.oneproject.Entity.Event;
import com.example.oneproject.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.oneproject.DTO.EventDTO;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import java.io.IOException;

@Service
@RequiredArgsConstructor

public class EventService {


    private final EventRepository eventRepository;
    private final S3Uploader s3Uploader;
    private final S3Service s3Service;

    public void saveEvent(String title, String description, String startDate, String endDate, MultipartFile imageFile)
            throws IOException {

        String imageUrl = s3Uploader.uploadFile("eventImages", imageFile);

        Event event = new Event();

        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setImageUrl(imageUrl);

        eventRepository.save(event);
    }

    public List<EventDTO> getAllEvents() {

        List<Event> eventsFromDB = eventRepository.findAll();

        return eventsFromDB.stream()
                .map(eventEntity -> {


                    String finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());

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
    public EventDTO getEventById(Long id) {
        // 1. DB 창고 관리인에게 "ID가 일치하는 Event 재료 하나만 찾아주세요" 라고 요청합니다.
        //    findById는 결과가 있을 수도, 없을 수도 있기 때문에 'Optional'이라는 특별한 상자에 담아서 줍니다.
        Optional<Event> optionalEvent = eventRepository.findById(id);

        // 2. Optional 상자를 열어서 찾아온 재료가 있는지 확인합니다.
        if (optionalEvent.isPresent()) {
            Event eventEntity = optionalEvent.get(); // 상자에서 실제 Event 객체를 꺼냅니다.

            // 3. (getAllEvents와 동일) 꺼내온 재료를 DTO 배달 상자에 옮겨 담습니다.
            String finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());

            EventDTO eventDTO = new EventDTO();
            eventDTO.setId(eventEntity.getId());
            eventDTO.setTitle(eventEntity.getTitle());
            eventDTO.setDescription(eventEntity.getDescription());
            eventDTO.setStartDate(eventEntity.getStartDate());
            eventDTO.setEndDate(eventEntity.getEndDate());
            eventDTO.setImageUrl(finalImageUrl);

            return eventDTO; // 포장이 끝난 DTO 상자를 반환합니다.
        } else {
            // 4. 재료를 찾지 못했다면, null을 반환하여 "그런 이벤트는 없습니다" 라고 알립니다.
            return null;
        }
    }
}


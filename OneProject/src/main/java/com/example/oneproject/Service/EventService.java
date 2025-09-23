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
}


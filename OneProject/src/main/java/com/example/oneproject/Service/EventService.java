package com.example.oneproject.Service;

import com.example.oneproject.Entity.Event;
import com.example.oneproject.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.oneproject.DTO.EventDTO;
import com.example.oneproject.Service.S3Uploader; // 가정: S3Uploader가 서비스 폴더 내에 있다고 가정
import com.example.oneproject.Service.S3Service; // 가정: S3Service가 서비스 폴더 내에 있다고 가정
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EventService {


    private final EventRepository eventRepository;
    // S3Uploader와 S3Service는 S3 작업을 위한 의존성입니다.
    private final S3Uploader s3Uploader;
    private final S3Service s3Service;

    /**
     * 새로운 이벤트를 저장하고, 저장된 Event 엔티티(ID 포함)를 반환합니다.
     * @param title 이벤트 제목
     * @param description 이벤트 설명
     * @param startDate 시작일
     * @param endDate 종료일
     * @param imageFile 대표 이미지 파일
     * @return DB에 저장되어 ID가 부여된 Event 엔티티
     * @throws IOException
     */
    // ⭐️ 이벤트 생성 후 상세 페이지 이동을 위해 Event 객체를 반환합니다.
    public Event saveEvent(String title, String description, String startDate, String endDate, MultipartFile imageFile)
            throws IOException {

        // 1. S3에 이미지 업로드 및 URL 획득
        String imageUrl = s3Uploader.uploadFile("eventImages", imageFile);

        // 2. Event 엔티티 생성
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setImageUrl(imageUrl);

        // 3. DB에 저장 후, 자동 생성된 ID와 함께 저장된 Event 객체를 반환
        return eventRepository.save(event);
    }

    /**
     * 모든 이벤트를 조회하여 DTO 리스트로 변환합니다.
     * @return EventDTO 리스트
     */
    public List<EventDTO> getAllEvents() {

        List<Event> eventsFromDB = eventRepository.findAll();

        return eventsFromDB.stream()
                .map(eventEntity -> {
                    // S3 Pre-signed URL 생성
                    String finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());

                    // DTO 변환
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

    /**
     * 특정 제목의 이벤트 상세 정보를 조회합니다.
     * @param title 이벤트 제목 (유니크해야 함)
     * @return EventDTO
     */
    // ⭐️ [수정] ID 대신 제목(title)을 기준으로 조회하도록 변경했습니다.
    public EventDTO getEventByTitle(String title) {
        // 1. DB에서 제목으로 이벤트 조회 (EventRepository에 findByTitle 메서드 추가 필수)
        Optional<Event> optionalEvent = eventRepository.findByTitle(title);

        // 2. 결과 유효성 검사 및 DTO 변환
        if (optionalEvent.isPresent()) {
            Event eventEntity = optionalEvent.get();

            // S3 Pre-signed URL 생성
            String finalImageUrl = s3Service.generatePresignedUrl(eventEntity.getImageUrl());

            // DTO 변환
            EventDTO eventDTO = new EventDTO();
            eventDTO.setId(eventEntity.getId());
            eventDTO.setTitle(eventEntity.getTitle());
            eventDTO.setDescription(eventEntity.getDescription());
            eventDTO.setStartDate(eventEntity.getStartDate());
            eventDTO.setEndDate(eventEntity.getEndDate());
            eventDTO.setImageUrl(finalImageUrl);

            return eventDTO;
        } else {
            return null;
        }
    }

    /**
     * 이벤트 ID 리스트를 받아 일괄 삭제 처리합니다. (DB 레코드 및 S3 이미지 파일)
     * @param ids 삭제할 이벤트 ID 리스트
     */
    public void deleteEvents(List<Long> ids) {
        // 1. 삭제할 이벤트들을 모두 찾습니다.
        List<Event> eventsToDelete = eventRepository.findAllById(ids);

        // 2. S3에서 파일 먼저 삭제
        for (Event event : eventsToDelete) {
            try {
                // S3 이미지 URL에서 파일 이름(키)만 추출하여 삭제
                s3Uploader.deleteFile(event.getImageUrl());
            } catch (Exception e) {
                // S3 삭제 실패는 로깅하고 DB 삭제는 계속 진행
                System.err.println("S3 파일 삭제 실패: " + event.getImageUrl() + " - " + e.getMessage());
            }
        }

        // 3. DB 레코드 일괄 삭제
        eventRepository.deleteAll(eventsToDelete);
    }
}
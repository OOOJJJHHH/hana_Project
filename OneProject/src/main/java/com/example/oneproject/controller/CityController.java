package com.example.oneproject.controller;


import com.example.oneproject.DTO.*;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Enum.ReservationStatus;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.Repository.WishListRepository;
import com.example.oneproject.Service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
public class CityController {


    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityService cityService;

    @Autowired
    private EventService eventService;

    @Autowired
    private  WishListService wishListService;

    @Autowired
    private LodService lodService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private final RoomService roomService;

    @Autowired
    private final S3Service s3Service;

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CLodRepository lodRepository;


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
    // ✅ ID 기반 삭제 엔드포인트 추가 (프론트엔드 About.jsx와 경로 일치)
    @DeleteMapping("/deleteEventById/{eventId}")
    public ResponseEntity<String> deleteEventById(@PathVariable Long eventId) {
        try {
            // EventService의 ID 기반 삭제 메소드 호출
            boolean success = eventService.deleteEventById(eventId);

            if (success) {
                return ResponseEntity.ok("이벤트가 성공적으로 삭제되었습니다. ID: " + eventId);
            } else {
                // 해당 ID의 이벤트를 찾지 못한 경우
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제 실패: 해당 ID의 이벤트가 없습니다.");
            }
        } catch (Exception e) {
            // 삭제 과정 중 DB나 S3에서 예외가 발생한 경우 (Foreign Key 오류 등)
            System.err.println("이벤트 삭제 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("삭제 실패: 서버 내부 오류가 발생했습니다.");
        }
    }


    // 도시 정보 저장
    @PostMapping("/saveCity")
    public ResponseEntity<String> saveCity(
        @RequestParam("cityName") String cityName,
        @RequestParam("cityDetail") String cityDetail,
        @RequestParam(value = "cityImag", required = false) MultipartFile cityImag,
        @RequestParam("cityState") String cityState
    ) {
        try {

            cityService.saveCity(
                    cityName,
                    cityDetail,
                    cityImag,
                    cityState
            );
            return ResponseEntity.ok("저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("저장 실패: " + e.getMessage());
        }
    }

    // 도시 정보 가져오기 두개 같은 기능임
    @GetMapping("/getCity")
    public List<CityContentDTO> getCity() {
        return cityService.getAllCityContents();
    }
    @GetMapping("/getLod")
    public ResponseEntity<List<CityContentDTO>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCityContents());
    }

    // 숙소==============================================================================
    //
    @GetMapping("/getAllLodRoom")
    public List<LodAddPre> getAllLodRoom() {
        return lodService.getAllLodARoom();
    }
    //진짜 전부 숙소 정보 가져옴
    @GetMapping("/getAllLodgings")
    public List<LodDTO> getAllLodgings() {
        return lodService.getAllLod();
    }

    // 도시 이름으로 숙소 전체 조회
    @GetMapping("/getLodsByCity/{cityName}")
    public ResponseEntity<List<LodDTO>> getLodsByCity(@PathVariable String cityName) {
        String decodedCity = URLDecoder.decode(cityName, StandardCharsets.UTF_8);
        List<LodDTO> lods = lodService.getLodsByCityName(decodedCity);
        return ResponseEntity.ok(lods);
    }

    // 사용자 Id로 숙소 조회
    @GetMapping("/getlodbyUid/{uId}")
    public ResponseEntity<List<LodDTO>> getlodByUid(@PathVariable String uId) {
        // 🔍 uId로 UserContent 조회
        Optional<UserContent> userOpt = userRepository.findByUId(uId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // 유저 없을 경우 404 반환
        }

        String uFirstName = userOpt.get().getuFirstName();

        // 기존 서비스 그대로 사용
        List<LodDTO> lods = lodService.getLodsByUFirstName(uFirstName);
        return ResponseEntity.ok(lods);
    }

    // 사용자 이름으로 숙소 조회
    @GetMapping("/getlodbyName/{uFirstName}")
    public ResponseEntity<List<LodDTO>> getlodbyName(@PathVariable String uFirstName) {
        String decodedCity = URLDecoder.decode(uFirstName, StandardCharsets.UTF_8);
        List<LodDTO> lods = lodService.getLodsByUFirstName(decodedCity);
        return ResponseEntity.ok(lods);
    }

    // 숙소 이름으로 객실 조회
    @GetMapping("/getlodUseN/{lodName}")
    public ResponseEntity<LodAddPre> getLodAddPre(@PathVariable String lodName) {
        System.out.println("요청 받은 lodUseNm: " + lodName);
        LodAddPre lodAddPre = lodService.getLodDtoByName(lodName);
        if (lodAddPre == null) {
            System.out.println("데이터가 없습니다.");
        }
        return ResponseEntity.ok(lodAddPre);
    }

    // 숙소 저장
    @PostMapping("/addRoom")
    public ResponseEntity<String> saveLodWithImage(
            @RequestParam("lodOwner") String lodOwner,
            @RequestParam("lodCity") String lodCity,
            @RequestParam("lodName") String lodName,
            @RequestParam("lodLocation") String lodLocation,
            @RequestParam("lodCallNum") String lodCallNum,
            @RequestParam("rooms") String roomsJson,
            @RequestParam Map<String, MultipartFile> allFiles
    ) {
        try {
            // 숙소 이미지 수집
            List<MultipartFile> lodImages = allFiles.entrySet().stream()
                    .filter(entry -> entry.getKey().startsWith("lodImag"))
                    .sorted(Map.Entry.comparingByKey())
                    .map(Map.Entry::getValue)
                    .toList();

            // 객실 이미지 수집
            Map<Integer, List<MultipartFile>> roomImageMap = new HashMap<>();
            for (String key : allFiles.keySet()) {
                if (key.startsWith("roomImag")) {
                    String[] parts = key.replace("roomImag", "").split("_");
                    if (parts.length == 2) {
                        int roomIndex = Integer.parseInt(parts[0]);
                        roomImageMap.computeIfAbsent(roomIndex, k -> new ArrayList<>()).add(allFiles.get(key));
                    }
                }
            }

            // 객실 메타 정보
            ObjectMapper mapper = new ObjectMapper();
            List<Room> roomList = mapper.readValue(roomsJson, new TypeReference<List<Room>>() {});

            // 서비스 호출
            lodService.saveLodWithImages(
                    lodOwner,
                    lodCity,
                    lodName,
                    lodLocation,
                    lodCallNum,
                    lodImages,
                    roomList,
                    roomImageMap
            );

            return ResponseEntity.ok("저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("저장 실패: " + e.getMessage());
        }
    }

    // 숙소 수정 (단독)
    @PutMapping(value = "/lodging/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ClodContent> updateLodging(
            @PathVariable Long id,
            @RequestPart("data") LodgingUpdateDto dto,
            @RequestPart(value = "lodImag", required = false) MultipartFile lodImag
    ) {
        ClodContent updated = lodService.updateLodging(id, dto, lodImag);
        return ResponseEntity.ok(updated);
    }


    // 숙소 삭제 (객실 및 이미지 포함 전부 삭제됨)
    @DeleteMapping("/lodging/{id}")
    public ResponseEntity<?> deleteLodging(@PathVariable Long id) {
        lodService.deleteLodging(id);
        return ResponseEntity.ok().build();
    }

    // S3 이미지 변환
    @GetMapping("lodging/image/{key}")
    public String getPresignedUrl(@PathVariable String key) throws UnsupportedEncodingException {
        // 🔥 URL 인코딩된 S3 키 디코드 (예: lodUploads%2Fmy-image.jpg → lodUploads/my-image.jpg)
        String decodedKey = URLDecoder.decode(key, "UTF-8");
        return s3Service.generatePresignedUrl(decodedKey);
    }

    // --- 🚨 객실 일괄 업데이트/삭제/추가 API 🚨 ---
    // 프론트엔드의 AccommodationRoomRewrite 컴포넌트에서 호출될 엔드포인트
    @PutMapping("/batch-update")
    public ResponseEntity<?> batchUpdate(
            @RequestParam String lodName,
            @RequestPart("deletedRoomIds") String deletedRoomJson,
            @RequestPart("roomUpdates") String roomUpdatesJson,
            MultipartHttpServletRequest request // ✅ 변경된 부분
    ) throws IOException {

        System.out.println("=== batchUpdate() 호출됨 ===");
        System.out.println("숙소명: " + lodName);
        System.out.println("삭제할 객실 ID들: " + deletedRoomJson);
        System.out.println("객실 업데이트 데이터: " + roomUpdatesJson);

        // 1. JSON 디코딩
        List<Long> deletedRoomIds = objectMapper.readValue(deletedRoomJson, new TypeReference<>() {});
        List<RoomUpdateDto> updates = objectMapper.readValue(roomUpdatesJson, new TypeReference<>() {});

        // 2. 이미지 키-파일 매핑 생성 (roomImage_35, roomImage_new_0 ...)
        Map<String, List<MultipartFile>> roomImageMap = new HashMap<>();
        for (Iterator<String> it = request.getFileNames(); it.hasNext(); ) {
            String key = it.next(); // e.g., roomImage_35
            List<MultipartFile> files = request.getFiles(key);
            roomImageMap.put(key, files);
            System.out.println("📦 multipart key = " + key + " / 파일 수 = " + files.size());
        }

        // 3. 숙소 엔티티 조회
        Long lodId = lodRepository.findByLodName(lodName)
                .map(ClodContent::getId)
                .orElseThrow(() -> new IllegalArgumentException("숙소 없음: " + lodName));

        // 4. 서비스 호출
        roomService.processBatchUpdate(lodId, deletedRoomIds, updates, roomImageMap);

        return ResponseEntity.ok("객실 정보가 성공적으로 반영되었습니다.");
    }




    // 예약 ===========================================================================
    // 예약되어있는 날짜 확인
    @GetMapping("reservation/reserved-dates/{roomId}")
    public ResponseEntity<List<DateRangeDTO>> getReservedDates(@PathVariable Long roomId) {
        List<Reservation> list = reservationService.getReservedDatesByRoom(roomId);
        List<DateRangeDTO> ranges = list.stream()
                .map(r -> new DateRangeDTO(r.getStartDate(), r.getEndDate()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ranges);
    }


    // 예약 등록
    @PostMapping("/reservation")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequestDTO dto) {

        Reservation saved = reservationService.createReservation(dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "예약이 성공적으로 등록되었습니다.");
        response.put("reservationId", saved.getId());

        return ResponseEntity.ok(response);  // 🔄 JSON으로 응답
    }


    // 사용자 예약 내역 조회 (프론트에서 uId로 요청)
    @GetMapping("/api/reservations/{userUId}")
    public ResponseEntity<List<ReservationResponseDTO>> getReservations(@PathVariable String userUId) {
        List<ReservationResponseDTO> reservations = reservationService.getReservationsByUserUId(userUId);
        return ResponseEntity.ok(reservations);
    }

    // 마이페이지 특정 예약 삭제
    @DeleteMapping("/api/reservations/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok("예약이 삭제되었습니다. id=" + id);
    }

    // 사용자 예약 상태 변경 (프론트에서 예약 ID와 상태 전달)
    @PatchMapping("/api/reservations/{reservationId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long reservationId,
            @RequestBody Map<String, String> requestBody
    ) {
        String statusStr = requestBody.get("status");

        try {
            ReservationStatus status = ReservationStatus.valueOf(statusStr);
            reservationService.updateReservationStatus(reservationId, status);
            return ResponseEntity.ok("상태가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("유효하지 않은 상태입니다.");
        }
    }


    // 숙소 주인의 예약 목록 조회
    @GetMapping("/api/reservations/landlord/{lodOwnerId}")
    public ResponseEntity<List<ReservationResponseDTO>> getPendingReservations(@PathVariable String lodOwnerId) {
        List<ReservationResponseDTO> reservations = reservationService.findPendingReservationsByUId(lodOwnerId);
        return ResponseEntity.ok(reservations);
    }

    // 예약 수락
    @PatchMapping("/api/reservations/{reservationId}/approve")
    public ResponseEntity<Void> approveReservation(@PathVariable Long reservationId) {
        reservationService.approveReservation(reservationId);
        return ResponseEntity.ok().build();
    }

    // 예약 거절
    @PatchMapping("/api/reservations/{reservationId}/reject")
    public ResponseEntity<Void> rejectReservation(@PathVariable Long reservationId) {
        reservationService.rejectReservation(reservationId);
        return ResponseEntity.ok().build();
    }

    // 리뷰 ==========================================================================
    // ✅ 리뷰 등록
    @PostMapping("/saveReview")
    public ResponseEntity<String> saveReview(@RequestBody ReviewDTO reviewDto) {
        System.out.println("userId = " + reviewDto.getUserId());
        try {
            reviewService.createReview(reviewDto);
            return ResponseEntity.ok("리뷰 등록 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("리뷰 등록 실패: " + e.getMessage());
        }
    }

    // ✅ 특정 숙소 및 객실의 리뷰 조회
    @GetMapping("/getReviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRoom(
            @RequestParam Long clodContentId,
            @RequestParam Long roomId
    ) {
        try {
            List<Review> reviews = reviewService.getReviewsForRoom(clodContentId, roomId);
            List<ReviewDTO> result = reviews.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Review → ReviewDTO 변환
    private ReviewDTO toDto(Review review) {
        Long id = review.getId();
        String userId = (review.getUser() != null) ? review.getUser().getuId() : null;
        Long clodContentId = (review.getClodContent() != null) ? review.getClodContent().getId() : null;
        Long roomId = (review.getRoom() != null) ? review.getRoom().getId() : null;

        return new ReviewDTO(
                id,
                userId,
                clodContentId,
                roomId,
                review.getRating(),
                review.getComment()
        );
    }

    // ✅ 특정 게시물 수정
    @PutMapping("/reviews/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO reviewDTO
    ) {
        try {
            reviewService.updateReview(id, reviewDTO);
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    // ✅ 특정 유저가 작성한 모든 리뷰 (마이페이지용)
    @GetMapping("/getMyReviews")
    public ResponseEntity<List<Review>> getMyReviews(@RequestParam String userId) {
        try {
            return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ 리뷰 하나 삭제
    @DeleteMapping("/deleteReview/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> body // { "userId": 1 }
    ) {
        try {
            reviewService.deleteReview(reviewId, body.get("userId"));
            return ResponseEntity.ok("리뷰 삭제 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("삭제 실패: " + e.getMessage());
        }
    }

    // ✅ 특정 숙소/객실의 해당 유저가 작성한 모든 리뷰 삭제
    @DeleteMapping("/deleteAllMyReviews")
    public ResponseEntity<String> deleteAllMyReviews(@RequestBody Map<String, Long> body) {
        try {
            Long clodContentId = body.get("clodContentId");
            Long roomId = body.get("roomId");
            Long userId = body.get("userId");

            reviewService.deleteAllUserReviews(clodContentId, roomId, userId);
            return ResponseEntity.ok("해당 숙소/객실의 모든 리뷰 삭제 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("삭제 실패: " + e.getMessage());
        }
    }


    // 찜 ==============================================================================
    // 찜 확인 API
    @GetMapping("/wishlist/check")
    public ResponseEntity<Map<String, Object>> checkWishlist(
            @RequestParam String userName,
            @RequestParam String lodName,
            @RequestParam String roomName) {
        boolean isWished = wishListService.isWished(userName, lodName, roomName);
        return ResponseEntity.ok(Map.of("success", true, "isWish", isWished));
    }


    // 찜 추가 API
    @PostMapping("/wishlist/toggle")
    public ResponseEntity<Map<String, Object>> addWishlist(@RequestBody WishDTO dto) {
        boolean isNowWished = wishListService.toggleWish(dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "isWish", isNowWished,
                "message", isNowWished ? "찜목록에 추가되었습니다." : "찜목록에서 제거되었습니다."
        ));
    }

    //마이페이지 위시리스트에서 찜 확인
    @GetMapping("wishlist/{userId}")
    public List<WishListDTO> getWishlist(@PathVariable String userId) {
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return wishListService.getWishlistByUser(user);
    }


    // 유저==============================================================================
    // 유저 정보 저장
    @PostMapping("/saveUser")
    public void saveUser(@RequestBody UserContent userContent) {
        if(userContent.getProfileImage() == null || userContent.getProfileImage().isEmpty()) {

            userContent.setProfileImage("default_thing/user_default.png");
        }
        userService.saveUser(userContent);
    }

    @GetMapping("/getUser")
    public List<UserContent> getUser() {
        return userService.getUsers();
    }


    @GetMapping("/getLandlord")
    public List<UserContent> getLandlordList() {
        return userService.getLandlordList();
    }


    // 회원정보 가져오기 ====================================================================
    // ✅ 현재 로그인한 특정 사용자 정보 조회
    @GetMapping("/user/{uId}")
    public ResponseEntity<?> getUser(@PathVariable String uId) {
        return userService.getUserByUId(uId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 사용자 정보 수정
    @PutMapping("/user/{uId}")
    public ResponseEntity<?> updateUser(@PathVariable String uId, @RequestBody UserContent userData) {
        boolean updated = userService.updateUserInfo(uId, userData);
        if (updated) {
            return ResponseEntity.ok("회원 정보가 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
    }

// -준희- 필요없는거 같아서 주석
//    // 로그인한 사용자의 정보 수정
//    @PutMapping("/user/update")
//    public ResponseEntity<?> updateUserInfo(@RequestBody UserContent updatedUser, HttpSession session) {
//        String uId = (String) session.getAttribute("uId");
//        if (uId == null) {
//            return ResponseEntity.status(401).body("Unauthorized");
//        }
//
//        // 보안: 요청에 포함된 uId가 아니라 세션의 uId를 기준으로 수정
//        try {
//            UserContent updated = userService.updateUser(uId, updatedUser);
//            return ResponseEntity.ok(updated);
//        } catch (Exception e) {
//            return ResponseEntity.status(404).body(e.getMessage());
//        }
//    }
//

    // 로그인=============================================================================
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody UserContent userContent, HttpSession session) {
        String uId = userContent.getuId();
        String uPassword = userContent.getuPassword();
        String result = userService.login(uId, uPassword, session);

        if ("로그인성공".equals(result)) {
            UserDTO user = (UserDTO) session.getAttribute("loginUser");
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body(result);
        }
    }

    @GetMapping("/api/getSessionInfo")
    public ResponseEntity<?> getSessionInfo(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("loginUser");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }
    }

    @PostMapping("/api/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(filePath))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @DeleteMapping("/deleteProfileImage")
    public ResponseEntity<?> deleteProfileImage(@RequestParam String userId) {
        Optional<UserContent> optionalUser = userRepository.findByUId(userId);
        if (optionalUser.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        UserContent user = optionalUser.get();
        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
            String key = user.getProfileImage().substring(user.getProfileImage().indexOf("profileImages"));
            s3Uploader.deleteFile(key);  // 기존에 만든 deleteFile 메서드
            user.setProfileImage(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok("삭제 완료");
    }


//    @PostMapping("/api/googleLogin")
//    public ResponseEntity<?> googleLogin(@RequestBody UserDTO googleLoginRequest, HttpSession session) {
//        // "google_" 접두사 제거
//        String actualGoogleId = googleLoginRequest.getuId().replace("google_", "");
//
//        // DB에서 기존 사용자 조회 (구글 ID 기준)
//        Optional<UserContent> existingUserOptional = userService.findByGoogleId(actualGoogleId);
//
//        UserContent userToReturn;
//
//        if (existingUserOptional.isPresent()) {
//            // ✅ 기존 사용자 → 이름/이메일 업데이트
//            userToReturn = existingUserOptional.get();
//            userToReturn.setuFirstName(googleLoginRequest.getuFirstName());
//            if (googleLoginRequest.getUIdEmail() != null && !googleLoginRequest.getUIdEmail().isEmpty()) {
//                userToReturn.setuIdEmail(googleLoginRequest.getUIdEmail());
//            }
//            userService.saveUser(userToReturn);
//        } else {
//            // ✅ 신규 사용자 등록
//            UserContent newUser = new UserContent();
//            newUser.setuId(googleLoginRequest.getuId()); // ex) google_123456
//            newUser.setuIdEmail(googleLoginRequest.getUIdEmail());
//            newUser.setuFirstName(googleLoginRequest.getuFirstName());
//            newUser.setuLastName(googleLoginRequest.getULastName());
//            newUser.setuUser(googleLoginRequest.getuUser());
//            newUser.setGoogleId(actualGoogleId); // ✅ 구글 ID 저장 (접두사 없는 값)
//            newUser.setuPassword(""); // 비밀번호 없음
//
//            userToReturn = userService.saveUser(newUser);
//        }
//
//        // 세션에 사용자 저장
//        session.setAttribute("loginUser", userToReturn);
//
//        return ResponseEntity.ok(userToReturn);
//    }


    @PostMapping("/user/profile/upload")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            // ✅ 이미지 업로드 후 key 받기
            String key = userService.updateProfileImage(userId, file);

            // ✅ key만 리턴
            return ResponseEntity.ok(key);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("업로드 실패: " + e.getMessage());
        }
    }
        @GetMapping("/checkId")
        public Map<String, Boolean> checkId(@RequestParam("uId") String uId) {
            boolean exists = userRepository.findByUId(uId).isPresent();
            return Map.of("available", !exists);
        }






}

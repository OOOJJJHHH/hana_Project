package com.example.oneproject.controller;


import com.amazonaws.services.ec2.model.Reservation;
import com.example.oneproject.DTO.CityContentDTO;
import com.example.oneproject.DTO.LodAddPre;
import com.example.oneproject.DTO.LodDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.Repository.WishListRepository;
import com.example.oneproject.Service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import com.example.oneproject.DTO.UserDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CityController {


    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityService cityService;

    @Autowired
    private  WishListService wishListService;

    @Autowired
    private LodService lodService;

    @Autowired
    private UserService userService;

    @Autowired
    private WishListRepository wishListRepository;

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
        LodAddPre lodAddPre = lodService.getLodDtoByName(lodName);
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




    // 유저==============================================================================
    // 유저 정보 저장
    @PostMapping("/saveUser")
    public void saveUser(@RequestBody UserContent userContent) {
        if(userContent.getProfileImage() == null || userContent.getProfileImage().isEmpty()) {

            userContent.setProfileImage("default_thing/user_default.png");
        }
        userService.saveUser(userContent);
    }

    // 찜 추가 API
    @PostMapping("/wishlist/add")
    public ResponseEntity<Map<String, Object>> addWishlist(
            @RequestParam Long userId,
            @RequestParam String lodName,
            @RequestParam String roomName
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String result = wishListService.addWishListByUserId(userId, lodName, roomName); // 서비스도 변경 필요

            boolean isDuplicate = result.equals("이미 찜한 항목입니다.");
            response.put("success", !isDuplicate);
            response.put("message", result);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 찜 삭제
    @DeleteMapping("/wishlist/delete")
    public ResponseEntity<Map<String, Object>> deleteWishlist(
            @RequestParam Long userId,
            @RequestParam String lodName,
            @RequestParam String roomName
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            wishListService.removeWishlistByUserId(userId, lodName, roomName); // 서비스도 변경 필요
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 찜 목록 조회
    @GetMapping("/wishlist/{id}")
    public ResponseEntity<List<Map<String, Object>>> getUserWishlist(@PathVariable Long userId) {
        List<WishList> wishList = wishListRepository.findByUser_Id(userId); // 기존에 findByUser_UId였다면 메서드도 수정

        List<Map<String, Object>> result = wishList.stream().map(w -> {
            Map<String, Object> map = new HashMap<>();
            map.put("lodName", w.getClodContent().getLodName());
            map.put("lodLocation", w.getClodContent().getLodLocation());
            map.put("roomName", w.getRoom().getRoomName());
            map.put("roomPrice", w.getRoom().getPrice());
            map.put("roomImage", w.getRoom().getRoomImag());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }


    @GetMapping("/wishlist/{userPkId}") // userId → userPkId 로 헷갈리지 않게 명확히
    public ResponseEntity<List<Map<String, Object>>> getUserWishlistById(@PathVariable Long userPkId) {
        Optional<UserContent> optionalUser = userRepository.findById(userPkId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<WishList> wishList = wishListRepository.findByUser(optionalUser.get());

        List<Map<String, Object>> result = wishList.stream().map(w -> {
            Map<String, Object> map = new HashMap<>();
            map.put("lodName", w.getClodContent().getLodName());
            map.put("lodLocation", w.getClodContent().getLodLocation());
            map.put("roomName", w.getRoom().getRoomName());
            map.put("roomPrice", w.getRoom().getPrice());
            map.put("roomImage", w.getRoom().getRoomImag());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }



    @GetMapping("/getUser")
    public List<UserContent> getUser() {
        return userService.getUsers();
    }

    @GetMapping("/getOneUser")
    public List<UserContent> getOneUser(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("loginUser");
        System.out.println(user);
        String uId = user.getuId();
        return userService.getOneUsers(uId);
    }

    @GetMapping("/getLandlord")
    public List<UserContent> getLandlordList() {
        return userService.getLandlordList();
    }

    @GetMapping("/user/{uId}")
    public ResponseEntity<UserContent> getUserByUId(@PathVariable String uId) {
        return userRepository.findByUId(uId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }




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



}

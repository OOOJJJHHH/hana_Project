package com.example.oneproject.controller;


import com.example.oneproject.DTO.CityContentDTO;
import com.example.oneproject.DTO.LodAddPre;
import com.example.oneproject.DTO.LodDTO;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.Service.S3Uploader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Service.CityService;
import com.example.oneproject.Service.LodService;
import com.example.oneproject.Service.UserService;
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
import java.util.List;
import java.util.UUID;
import java.util.Optional;




@RestController
public class CityController {


    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityService cityService;
    @Autowired
    private LodService lodService;
    @Autowired
    private UserService userService;

    @GetMapping("/getLandlord")
    public List<UserContent> getLandlordList() {
        return userRepository.findAll();
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

    // 도시 정보 가져오기
    @GetMapping("/getCity")
    public List<CityContentDTO> getCity() {
        return cityService.getAllCityContents();
    }

    
    
    // 숙소
    // 도시 이름으로 숙소 전체 조회
    @GetMapping("/getLodsByCity/{cityName}")
    public ResponseEntity<List<LodDTO>> getLodsByCity(@PathVariable String cityName) {
        String decodedCity = URLDecoder.decode(cityName, StandardCharsets.UTF_8);
        List<LodDTO> lods = lodService.getLodsByCityName(decodedCity);
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
            @RequestParam("lodImag") MultipartFile lodImag,
            @RequestParam("rooms") String roomsJson,
            @RequestParam("roomImag0") MultipartFile roomImag0,
            @RequestParam(value = "roomImag1", required = false) MultipartFile roomImag1,
            @RequestParam(value = "roomImag2", required = false) MultipartFile roomImag2
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Room> roomList = mapper.readValue(roomsJson, new TypeReference<List<Room>>() {});

            lodService.saveLodWithImages(
                    lodOwner,
                    lodCity,
                    lodName,
                    lodLocation,
                    lodCallNum,
                    lodImag,
                    roomList,
                    roomImag0,
                    roomImag1,
                    roomImag2
            );
            return ResponseEntity.ok("저장 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("저장 실패: " + e.getMessage());
        }
    }

    // 숙소 정보 조회
    @GetMapping("/getLod")
    public ResponseEntity<List<CityContentDTO>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCityContents());
    }

    
    
    // 유저 정보 저장
    @PostMapping("/saveUser")
    public void saveUser(@RequestBody UserContent userContent) {
        userService.saveUser(userContent);
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

    // 로그인
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

    @PostMapping("/uploadProfileImage")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                     @RequestParam("userId") String userId) {
        try {
            String dir = "profileImages";

            // 사용자 조회
            UserContent user = userRepository.findByUId(userId)
                    .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

            // 기존 프로필 이미지가 있으면 삭제
            String oldImageUrl = user.getProfileImage();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldKey = oldImageUrl.substring(oldImageUrl.indexOf(dir)); // "profileImages/~~~.png"
                s3Uploader.deleteFile(oldKey);
            }

            // 새 이미지 업로드
            String key = s3Uploader.uploadFile(dir, file);
            String imageUrl = "https://hana-leeej-bucket.s3.ap-northeast-3.amazonaws.com/" + key;

            // DB 갱신
            user.setProfileImage(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("업로드 실패: " + e.getMessage());
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

    // 카카오 로그인 API 추가
    @PostMapping("/api/kakaoLogin")
    public ResponseEntity<?> kakaoLogin(@RequestBody UserDTO kakaoLoginRequest, HttpSession session) {
        String actualKakaoId = kakaoLoginRequest.getuId().replace("kakao_", "");
        Optional<UserContent> existingUserOptional = userService.findByKakaoId(actualKakaoId);

        UserContent userToReturn;

        if (existingUserOptional.isPresent()) {
            userToReturn = existingUserOptional.get();
            userToReturn.setuFirstName(kakaoLoginRequest.getuFirstName());
            if (kakaoLoginRequest.getUIdEmail() != null && !kakaoLoginRequest.getUIdEmail().isEmpty()) {
                userToReturn.setuIdEmail(kakaoLoginRequest.getUIdEmail());
            }
            userService.saveUser(userToReturn);
        } else {
            UserContent newUser = new UserContent();
            newUser.setuId(kakaoLoginRequest.getuId());
            newUser.setuIdEmail(kakaoLoginRequest.getUIdEmail());
            newUser.setuFirstName(kakaoLoginRequest.getuFirstName());
            newUser.setuLastName(kakaoLoginRequest.getULastName());
            newUser.setuUser(kakaoLoginRequest.getuUser());
            newUser.setKakaoId(actualKakaoId);
            newUser.setuPassword(""); // 비밀번호는 카카오 로그인 시 사용 안 함

            userToReturn = userService.saveUser(newUser);
        }

        session.setAttribute("loginUser", userToReturn); // UserContent 저장
        return ResponseEntity.ok(userToReturn);
    }
}

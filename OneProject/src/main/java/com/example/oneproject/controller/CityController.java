package com.example.oneproject.controller;

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

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
public class CityController {

    @Autowired
    private CityService cityService;
    @Autowired
    private LodService lodService;
    @Autowired
    private UserService userService;

    // 도시 정보 저장
    @PostMapping("/saveCity")
    public void saveCity(@RequestBody CityContent cityContent) {
        cityService.saveCity(cityContent);
    }

    // 도시 정보 가져오기
    @GetMapping("/getCity")
    public List<CityContent> getCity() {
        return cityService.getAllCities();
    }

    // 도시 이름으로 숙소 검색
    @GetMapping("/findByName")
    public ResponseEntity<List<ClodContent>> getCityByName(@RequestParam("cityName") String cityName) {
        List<ClodContent> lodContents = lodService.getCityByName(cityName);
        if (lodContents.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lodContents);
    }

    // 도시 상태 업데이트
    @PatchMapping("/updateCity/{cityName}")
    public ResponseEntity<String> updateCity(@PathVariable("cityName") String cityName) {
        try {
            cityService.updateCityField(cityName);
            return ResponseEntity.ok("City updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating city");
        }
    }

    // ✅ 숙소 + 객실 저장 (rooms JSON 포함)
    @PostMapping("/getCity")
    public ResponseEntity<String> saveLodWithRooms(@RequestParam Map<String, String> formData,
                                                   @RequestParam("rooms") String roomsJson) {
        try {
            System.out.println("💡 받은 rooms JSON 문자열: " + roomsJson);

            ObjectMapper mapper = new ObjectMapper();
            List<Room> roomList = mapper.readValue(roomsJson, new TypeReference<List<Room>>() {});

            ClodContent content = new ClodContent();
            content.setLodOwner(formData.get("lodOwner"));
            content.setLodCity(formData.get("lodCity"));
            content.setLodName(formData.get("lodName"));
            content.setLodLocation(formData.get("lodLocation"));
            content.setLodCallNum(formData.get("lodCallNum"));
            content.setLodImag(formData.get("lodImag"));
            content.setLodPrice(new BigDecimal("0")); // TODO: 추후 평균 계산 등 가능

            for (Room room : roomList) {
                System.out.println("📦 roomName: " + room.getRoomName());
                System.out.println("📦 roomPrice: " + room.getPrice());
                System.out.println("📦 roomImag: " + room.getRoomImag());

                if (room.getPrice() == null) {
                    System.err.println("❗ 오류: room.price가 null입니다!");
                }

                room.setClodContent(content);
            }

            content.setRooms(roomList);
            lodService.savelod(content);
            return ResponseEntity.ok("저장 완료");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("저장 실패: " + e.getMessage());
        }
    }

    // 숙소 정보 조회
    @GetMapping("/getLod")
    public List<ClodContent> getLod() {
        return lodService.getAllLods();
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
}

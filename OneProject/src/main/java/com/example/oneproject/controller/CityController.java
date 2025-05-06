package com.example.oneproject.controller;

import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Service.CityService;
import com.example.oneproject.Service.LodService;
import com.example.oneproject.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class CityController {

    @Autowired
    private CityService cityService;
    @Autowired
    private LodService lodService;
    @Autowired
    private UserService userService;

    //도시 정보 저장
    @PostMapping("/saveCity")
    public void saveCity(@RequestBody CityContent cityContent) {
        cityService.saveCity(cityContent);
    }
    //도시의 정보를 get
    @GetMapping("/getCity")
    public List<CityContent> getCity() {
        return cityService.getAllCities();
    }
//    //도시 정보 삭제
//    @PatchMapping("/delCity/{cityName}")
//    public void delCity(@PathVariable("cityName") String city_Name) {
//        return cityService.delCity(city_Name);
//    }

//    //도시 이름으로 검색
    @GetMapping("/findByName")
    public ResponseEntity<List<ClodContent>> getCityByName(@RequestParam("cityName") String cityName) {
        List<ClodContent> lodContents = lodService.getCityByName(cityName);

        if (lodContents.isEmpty()) {
            return ResponseEntity.notFound().build(); // 도시를 찾을 수 없으면 404 반환
        }

        return ResponseEntity.ok(lodContents); // 도시가 있으면 200 OK와 함께 반환

    }

    //도시들에서 선택한 도시에 대해 state의 값을 1로 바꿈
    @PatchMapping("/updateCity/{cityName}")
    public ResponseEntity<String> updateCity(@PathVariable("cityName") String cityName) {
        try {
            cityService.updateCityField(cityName); // 서비스 계층에서 처리
            return ResponseEntity.ok("City updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating city");
        }
    }





    // === 숙소 ===
    //숙소의 정보를 저장
    @PostMapping("/saveLod")
    public void saveLod(@RequestBody ClodContent clodContent) {
        lodService.savelod(clodContent);
    }
    //숙소의 정보를 get
    @GetMapping("/getLod")
    public List<ClodContent> getLod() {

        return lodService.getAllLods();
    }


    // === 유저 정보===
    @PostMapping("/saveUser")
    public void saveUser(@RequestBody UserContent userContent, HttpSession session) {
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







    //세션
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody UserContent userContent, HttpSession session) {

        String uId = userContent.getuId();
        String uPassword = userContent.getuPassword();
        String result = userService.login(uId, uPassword, session);

        System.out.println("Received result: " + result);

        if("로그인성공".equals(result)){
            System.out.println("잘되었어요");
            UserDTO user = (UserDTO) session.getAttribute("loginUser");
            System.out.println(user);
            return ResponseEntity.ok(user);
        }
        else{
            System.out.println("안되었어요");
            return ResponseEntity.status(401).body(result);
        }
    }




    @GetMapping("/api/getSessionInfo")
    public ResponseEntity<?> getSessionInfo(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("loginUser");

        if(user != null){
            return ResponseEntity.ok(user);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }
    }


    @PostMapping("/api/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // 세션 전체 삭제
        return ResponseEntity.ok("로그아웃 성공");
    }



}

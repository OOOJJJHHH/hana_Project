package com.example.oneproject.Service;

import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.DTO.UserUpdateDTO;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;


import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    private S3Service s3Service;

    // user 데이터 저장 (저장 후 저장된 엔티티 반환)
    public UserContent saveUser(UserContent userContent) {
        return userRepository.save(userContent);
    }

    // 유저 전부다 get
    public List<UserContent> getUsers() {
        return userRepository.findAll();
    }

    // 특정한 아이디 값에 해당하는 데이터를 get
    public List<UserContent> getOneUsers(String uId) {
        return userRepository.findByuId(uId);
    }

    // landlord인 사용자의 데이터 get
    public List<UserContent> getLandlord(){
        return userRepository.findByUUser("landlord");
    }


    public List<UserContent> getLandlordList() {
        List<UserContent> landlords = userRepository.findByUUser("landlord");

        // 엔티티 내부 profileImage 키 -> 프리사인드 URL로 교체
        for (UserContent user : landlords) {
            String key = user.getProfileImage();
            if (key != null && !key.isEmpty()) {
                String presignedUrl = s3Service.generatePresignedUrl(key);
                user.setProfileImage(presignedUrl);
            }
        }

        return landlords;
    }

    // 로그인한 uId로 유저 정보 조회
    public UserUpdateDTO getUserByUId(String uId) {
        Optional<UserContent> userOpt = userRepository.findByUId(uId);
        if (userOpt.isPresent()) {
            UserContent user = userOpt.get();

            UserUpdateDTO dto = new UserUpdateDTO();
            dto.setuId(user.getuId());
            dto.setuFirstName(user.getuFirstName());
            dto.setuLastName(user.getuLastName());
            dto.setuIdEmail(user.getuIdEmail());

            return dto;
        }
        return null; // 없으면 null 처리하거나 예외 처리 가능
    }

    // 유저 정보 업데이트
    @Transactional
    public UserUpdateDTO updateUser(UserUpdateDTO dto) {
        Optional<UserContent> userOpt = userRepository.findByUId(dto.getuId());
        if (userOpt.isPresent()) {
            UserContent user = userOpt.get();

            user.setuFirstName(dto.getuFirstName());
            user.setuLastName(dto.getuLastName());
            user.setuIdEmail(dto.getuIdEmail());

            // 필요하면 save 안 해도 JPA가 자동 반영해줌 (트랜잭션 안에서 변경감지)

            return dto;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // 로그인
    public String login(String uId, String uPassword, HttpSession session){
        Optional<UserContent> userOptional = userRepository.findByUId(uId);

        if(userOptional.isPresent()){
            UserContent userContent = userOptional.get();
            System.out.println(userContent);

            if(userContent.getuPassword().equals(uPassword)){
                UserDTO userDTO = new UserDTO(userContent.getuId(), userContent.getuFirstName(), userContent.getuUser());
                session.setAttribute("loginUser", userDTO);
                return "로그인성공";
            }
            else{
                return "비밀번호가 틀렸습니다";
            }
        }
        else{
            return "존재하지 않는 사용자";
        }
    }

    // googleId로 사용자 찾기
    public Optional<UserContent> findByGoogleId(String googleId) {
        return userRepository.findAll()
                .stream()
                .filter(user -> googleId.equals(user.getGoogleId()))
                .findFirst();
    }

    // 구글 사용자 저장용 (최초 로그인 시 자동 회원가입)
    public UserContent saveGoogleUser(UserContent userContent) {
        return userRepository.save(userContent);
    }
    // 프로필 이미지 업로드 및 저장
// 사용자 프로필 이미지를 업로드할 때 사용
    public String updateProfileImage(String userId, MultipartFile file) throws IOException {
        // 1️⃣ S3에 업로드 → key 받기
        String key = s3Uploader.uploadFile("userUploads", file); // 전체 URL 아님

        // 2️⃣ DB에 사용자 정보 업데이트
        Optional<UserContent> optionalUser = userRepository.findByUId(userId);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        UserContent user = optionalUser.get(); // 안전하게 꺼냄
        user.setProfileImage(key);
        userRepository.save(user);

        // 3️⃣ key 리턴
        return key;
    }


    // ✅ 유저 정보 조회 시 presigned 변환 제거
    public UserContent getUserWithImage(String userId) {
        return userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));
    }



}

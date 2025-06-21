package com.example.oneproject.Service;

import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    // kakaoId로 사용자 찾기
    public Optional<UserContent> findByKakaoId(String kakaoId) {
        return userRepository.findAll()
                .stream()
                .filter(user -> kakaoId.equals(user.getKakaoId()))
                .findFirst();
    }

    // 카카오 사용자 저장용 (최초 로그인 시 자동 회원가입)
    public UserContent saveKakaoUser(UserContent userContent) {
        return userRepository.save(userContent);
    }

    // 프로필 이미지 업로드 및 저장
    public void updateProfileImage(String userId, MultipartFile image) throws IOException {
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // 이미지 업로드
        String key = s3Uploader.uploadFile("userUploads", image);
        user.setProfileImage(key);

        userRepository.save(user);
    }

    // 유저 정보 조회 (프리사인드 URL 포함)
    public UserContent getUserWithImage(String userId) {
        UserContent user = userRepository.findByUId(userId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // S3 이미지 URL 변환
        if (user.getProfileImage() != null) {
            String imageUrl = s3Service.generatePresignedUrl(user.getProfileImage());
            user.setProfileImage(imageUrl);
        }

        return user;
    }


}

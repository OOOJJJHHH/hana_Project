package com.example.oneproject.Service;

import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // user 데이터 저장
    public void saveUser(UserContent userContent) {
        userRepository.save(userContent);
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

    // 로그인을 위해서 세션에 값 저장
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

}

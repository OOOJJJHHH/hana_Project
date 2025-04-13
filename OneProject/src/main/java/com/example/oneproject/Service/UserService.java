package com.example.oneproject.Service;

import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void saveUser(UserContent userContent) {
        userRepository.save(userContent);
    }



}

package com.example.oneproject.Repository;

import com.example.oneproject.DTO.UserDTO;
import com.example.oneproject.Entity.UserContent;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserContent, Long> {

    Optional<UserContent> findByUId(String uId);

    List<UserContent> findByuId(String uId);

}

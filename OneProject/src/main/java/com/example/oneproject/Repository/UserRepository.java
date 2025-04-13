package com.example.oneproject.Repository;

import com.example.oneproject.Entity.UserContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserContent, Long> {

}

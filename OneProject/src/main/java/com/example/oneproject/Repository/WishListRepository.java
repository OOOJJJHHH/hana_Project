package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Long> {

    // 중복 찜 방지용: 동일 사용자 + 숙소 + 방에 대한 찜 여부 체크
    Optional<WishList> findByUserAndClodContentAndRoom(UserContent user, ClodContent clodContent, Room room);
}

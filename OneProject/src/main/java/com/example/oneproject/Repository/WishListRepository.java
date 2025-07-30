package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {
    Optional<WishList> findByUserAndClodContentAndRoom(UserContent user, ClodContent clodContent, Room room);

    boolean existsByUserAndClodContentAndRoom(UserContent user, ClodContent clod, Room room);

    List<WishList> findByUser(UserContent userContent);

    void deleteByRoomId(Long roomId);

    List<WishList> findByUser_Id(Long userId);
}


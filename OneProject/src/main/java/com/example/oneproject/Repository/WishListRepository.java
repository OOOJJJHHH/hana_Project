package com.example.oneproject.Repository;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Entity.WishList;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {
    Optional<WishList> findByUserAndClodContentAndRoom(UserContent user, ClodContent clodContent, Room room);

    // User 기준으로 WishList 조회, Room과 RoomImages를 join fetch
    @EntityGraph(attributePaths = {"room", "room.roomImages", "clodContent"})
    List<WishList> findByUser(UserContent user);

    void deleteAllByUser(UserContent user);
}


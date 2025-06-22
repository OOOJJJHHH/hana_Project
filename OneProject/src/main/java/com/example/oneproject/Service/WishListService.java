package com.example.oneproject.Service;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import com.example.oneproject.Entity.WishList;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.Repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userContentRepository;
    private final CLodRepository clodContentRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public String addWishListByUserId(Long userId, String lodName, String roomName) {
        // 1. 사용자 조회
        UserContent user = userContentRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 숙소 조회
        ClodContent lod = clodContentRepository.findByLodName(lodName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 숙소입니다."));

        // 3. 방 찾기 (숙소 안에서 roomName 일치하는 Room)
        Room room = lod.getRooms().stream()
                .filter(r -> r.getRoomName().equals(roomName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 숙소에 해당 이름의 방이 없습니다."));

        // 4. 중복 체크
        if (wishListRepository.findByUserAndClodContentAndRoom(user, lod, room).isPresent()) {
            return "이미 찜한 항목입니다.";
        }

        // 5. 저장
        WishList wish = WishList.builder()
                .user(user)
                .clodContent(lod)
                .room(room)
                .build();

        wishListRepository.save(wish);
        return "찜목록에 추가되었습니다.";
    }

    @Transactional
    public void removeWishlist(String userId, String lodName, String roomName) {
        UserContent user = userContentRepository.findByUId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        ClodContent lod = clodContentRepository.findByLodName(lodName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 숙소입니다."));

        Room room = lod.getRooms().stream()
                .filter(r -> r.getRoomName().equals(roomName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("숙소 '" + lodName + "' 안에 '" + roomName + "' 방이 없습니다."));

        WishList wish = wishListRepository.findByUserAndClodContentAndRoom(user, lod, room)
                .orElseThrow(() -> new IllegalArgumentException("찜 내역이 없습니다."));

        wishListRepository.delete(wish);
    }

    @Transactional
    public void removeWishlistByUserId(Long userId, String lodName, String roomName) {
        UserContent user = userContentRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        ClodContent lod = clodContentRepository.findByLodName(lodName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 숙소입니다."));

        Room room = lod.getRooms().stream()
                .filter(r -> r.getRoomName().equals(roomName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("숙소 '" + lodName + "' 안에 '" + roomName + "' 방이 없습니다."));

        WishList wish = wishListRepository.findByUserAndClodContentAndRoom(user, lod, room)
                .orElseThrow(() -> new IllegalArgumentException("찜 내역이 없습니다."));

        wishListRepository.delete(wish);
    }
}

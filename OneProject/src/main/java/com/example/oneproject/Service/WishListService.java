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
    public String addWishList(String userId, String lodName, String roomName) {

        // 1. 사용자 조회
        UserContent user = userContentRepository.findByUId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 숙소 조회 (이름으로)
        ClodContent lod = clodContentRepository.findByLodName(lodName)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 숙소입니다."));

        // 3. 방 조회 (숙소 내에서 방 이름으로)
        Room room = roomRepository.findByRoomNameAndClodContent(roomName, lod)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 방입니다."));

        // 4. 중복 찜 확인
        if(wishListRepository.findByUserAndClodContentAndRoom(user, lod, room).isPresent()) {
            return "이미 찜한 항목입니다.";
        }

        // 5. 찜 저장
        WishList wish = WishList.builder()
                .user(user)
                .clodContent(lod)
                .room(room)
                .build();

        wishListRepository.save(wish);

        return "찜목록에 추가되었습니다.";
    }
}
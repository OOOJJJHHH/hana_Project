package com.example.oneproject.Service;

import com.example.oneproject.DTO.WishDTO;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;

    public boolean isWished(String userName, String lodName, String roomName) {
        UserContent user = userRepository.findByUFirstName(userName)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));
        ClodContent clod = clodRepository.findByLodName(lodName)
                .orElseThrow(() -> new IllegalArgumentException("숙소 정보를 찾을 수 없습니다."));
        Room room = roomRepository.findByRoomNameAndClodContent(roomName, clod)
                .orElseThrow(() -> new IllegalArgumentException("방 정보를 찾을 수 없습니다."));

        return wishListRepository.findByUserAndClodContentAndRoom(user, clod, room).isPresent();
    }

    public boolean toggleWish(WishDTO dto) {
        UserContent user = userRepository.findByUId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));
        ClodContent clod = clodRepository.findByLodName(dto.getLodName())
                .orElseThrow(() -> new IllegalArgumentException("숙소 정보를 찾을 수 없습니다."));
        Room room = roomRepository.findByRoomNameAndClodContent(dto.getRoomName(), clod)
                .orElseThrow(() -> new IllegalArgumentException("방 정보를 찾을 수 없습니다."));

        Optional<WishList> existingWish = wishListRepository.findByUserAndClodContentAndRoom(user, clod, room);

        if (existingWish.isPresent()) {
            wishListRepository.delete(existingWish.get());
            return false; // 찜 취소
        } else {
            WishList wish = new WishList();
            wish.setUser(user);
            wish.setClodContent(clod);
            wish.setRoom(room);
            wishListRepository.save(wish);
            return true; // 찜 추가
        }
    }


    /*
    @Transactional
    public String addWish(WishDTO dto) {
        // 1. 사용자 조회
        UserContent user = userRepository.findByUFirstName(dto.getUserName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2. 숙소 조회
        ClodContent lod = clodRepository.findByLodName(dto.getLodName())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 숙소입니다."));

        // 3. 방 조회 (해당 숙소 내에서 roomName 매칭)
        Room room = lod.getRooms().stream()
                .filter(r -> r.getRoomName().equals(dto.getRoomName()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 숙소에 해당 이름의 방이 없습니다."));

        // 4. 중복 체크
        if (wishListRepository.findByUserAndClodContentAndRoom(user, lod, room).isPresent()) {
            throw new IllegalArgumentException("이미 찜한 항목입니다.");
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
    */


}

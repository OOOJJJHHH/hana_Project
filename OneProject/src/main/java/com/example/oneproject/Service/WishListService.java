package com.example.oneproject.Service;

import com.example.oneproject.DTO.WishDTO;
import com.example.oneproject.DTO.WishListDTO;
import com.example.oneproject.Entity.*;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.UserRepository;
import com.example.oneproject.Repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;
    private final CLodRepository clodRepository;
    private final RoomRepository roomRepository;

    @Autowired
    private S3Service s3Service;

    public boolean isWished(String userName, String lodName, String roomName) {
        UserContent user = userRepository.findByUId(userName)
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

    public List<WishListDTO> getWishlistByUser(UserContent user) {
        List<WishList> wishlist = wishListRepository.findByUser(user);

        // DTO로 변환, RoomImages는 Presigned URL
        return wishlist.stream().map(item -> {
            List<String> imageUrls = new ArrayList<>();
            for (RoomImages img : item.getRoom().getRoomImages()) {
                imageUrls.add(s3Service.generatePresignedUrl(img.getImageKey()));
            }


            return WishListDTO.builder()
                    .lodName(item.getClodContent().getLodName())
                    .lodLocation(item.getClodContent().getLodLocation())
                    .roomName(item.getRoom().getRoomName())
                    .roomPrice(item.getRoom().getPrice())
                    .roomImages(imageUrls)
                    .build();
        }).toList();
    }


}

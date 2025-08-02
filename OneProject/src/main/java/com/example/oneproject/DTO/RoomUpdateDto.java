package com.example.oneproject.DTO;

/**
 * 객실 수정 및 생성 시 사용되는 DTO.
 * 프론트엔드에서 전송되는 객실 데이터 구조를 담는다.
 * 기존 객실은 id = "123", 새로운 객실은 id = "new_0" 등으로 전송됨.
 */
public class RoomUpdateDto {

    private String id;           // e.g., "35" or "new_0"
    private String roomName;     // 객실명
    private Integer price;       // 가격

    /**
     * 이 객실이 새로 생성되는 것인지 판별
     * @return true if id starts with "new_"
     */
    public boolean isNew() {
        return id != null && id.startsWith("new_");
    }

    /**
     * 기존 객실이라면, String id를 Long으로 변환 (실패 시 null 반환)
     * @return Long id or null
     */
    public Long getParsedId() {
        if (isNew()) return null;
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // --- Getter / Setter ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}

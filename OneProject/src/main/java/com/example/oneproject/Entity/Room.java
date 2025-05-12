package com.example.oneproject.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonSetter;

import java.math.BigDecimal;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String roomImag;

    @ManyToOne
    @JoinColumn(name = "clod_content_id")
    private ClodContent clodContent;

    public Long getId() {
        return id;
    }

    public String getRoomName() {
        return roomName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getRoomImag() {
        return roomImag;
    }

    public ClodContent getClodContent() {
        return clodContent;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    @JsonSetter("price")
    public void setPrice(Object value) {
        try {
            if (value instanceof Number) {
                this.price = new BigDecimal(((Number) value).toString());
            } else if (value instanceof String && !((String) value).isEmpty()) {
                this.price = new BigDecimal((String) value);
            } else {
                this.price = BigDecimal.ZERO;
            }
        } catch (Exception e) {
            System.err.println("Room 가격 변환 실패: " + value);
            this.price = BigDecimal.ZERO;
        }
    }

    public void setRoomImag(String roomImag) {
        this.roomImag = roomImag;
    }

    public void setClodContent(ClodContent clodContent) {
        this.clodContent = clodContent;
    }
}

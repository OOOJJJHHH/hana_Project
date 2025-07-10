package com.example.oneproject.DTO;

import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.UserContent;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
public class WishDTO {
    private String userName;
    private String lodName;
    private String roomName;
}

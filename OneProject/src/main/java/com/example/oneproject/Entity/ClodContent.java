package com.example.oneproject.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClodContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lodOwner;
    private String lodCity;
    private String lodName;
    private String lodLocation;
    private String lodCallNum;
    private String lodImag;

    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.ALL)
    @JsonManagedReference
    @BatchSize(size = 10)
    private List<Room> rooms;

    // ✅ Getter / Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLodOwner() {
        return lodOwner;
    }

    public void setLodOwner(String lodOwner) {
        this.lodOwner = lodOwner;
    }

    public String getLodCity() {
        return lodCity;
    }

    public void setLodCity(String lodCity) {
        this.lodCity = lodCity;
    }

    public String getLodName() {
        return lodName;
    }

    public void setLodName(String lodName) {
        this.lodName = lodName;
    }

    public String getLodLocation() {
        return lodLocation;
    }

    public void setLodLocation(String lodLocation) {
        this.lodLocation = lodLocation;
    }

    public String getLodCallNum() {
        return lodCallNum;
    }

    public void setLodCallNum(String lodCallNum) {
        this.lodCallNum = lodCallNum;
    }


    public String getLodImag() {
        return lodImag;
    }

    public void setLodImag(String lodImag) {
        this.lodImag = lodImag;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}

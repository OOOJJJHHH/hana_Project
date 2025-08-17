package com.example.oneproject.Entity;

import com.example.oneproject.Enum.ReservationStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserContent user;

    // ✅ 숙소
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lodging_id")
    private ClodContent clodContent;

    // ✅ 객실
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private int nights;

    @Column(length = 1000)
    private String memo;

    @Column(nullable = false)
    private boolean isPaid = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    @Column(nullable = false, unique = true, updatable = false)
    private String reservationCode;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Reservation() {
        // 기본 생성자
    }

    // 생성 메서드
    public Reservation(UserContent user, ClodContent clodContent, Room room,
                       LocalDateTime startDate, LocalDateTime endDate, int nights,
                       String memo, boolean isPaid, ReservationStatus status) {
        this.user = user;
        this.clodContent = clodContent;
        this.room = room;
        this.startDate = startDate;
        this.endDate = endDate;
        this.nights = nights;
        this.memo = memo;
        this.isPaid = isPaid;
        this.status = status;
        this.reservationCode = UUID.randomUUID().toString();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reservationCode == null) {
            this.reservationCode = UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getter/Setter 생략 없이 전부 수동 작성 (필요한 만큼 추가 가능)
    public Long getId() {
        return id;
    }

    public UserContent getUser() {
        return user;
    }

    public void setUser(UserContent user) {
        this.user = user;
    }

    public ClodContent getClodContent() {
        return clodContent;
    }

    public void setClodContent(ClodContent clodContent) {
        this.clodContent = clodContent;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public int getNights() {
        return nights;
    }

    public void setNights(int nights) {
        this.nights = nights;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

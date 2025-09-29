package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    Event findByTitle(String title);

    List<Event> findByMainBannerTrue();

    // ✅ 기존의 모든 메인 배너 초기화 (false로)
    @Modifying
    @Transactional
    @Query("UPDATE Event e SET e.mainBanner = false")
    void resetMainBanners();

    // ✅ 특정 이벤트를 메인 배너로 설정 (true로)
    @Modifying
    @Transactional
    @Query("UPDATE Event e SET e.mainBanner = true WHERE e.id = :eventId")
    void setMainBanner(Long eventId);
}

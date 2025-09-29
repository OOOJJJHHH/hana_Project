package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event findByTitle(String title);
    List<Event> findByMainBannerTrue();
}

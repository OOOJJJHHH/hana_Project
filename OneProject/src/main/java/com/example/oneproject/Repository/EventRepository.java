package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event findByTitle(String title);
}

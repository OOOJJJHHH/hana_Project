package com.example.oneproject.Repository;

import com.example.oneproject.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public class EventRepository extends JpaRepository<Event, Long> {
}

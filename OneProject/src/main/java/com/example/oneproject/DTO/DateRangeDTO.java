package com.example.oneproject.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateRangeDTO {
    private LocalDateTime start;
    private LocalDateTime end;

    public DateRangeDTO(LocalDateTime start, LocalDateTime end) {
        this.start = start;
        this.end = end;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public LocalDateTime getEnd() {
        return end;
    }
}

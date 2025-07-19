package com.example.oneproject.DTO;

import java.time.LocalDate;

public class DateRangeDTO {
    private LocalDate start;
    private LocalDate end;

    public DateRangeDTO(LocalDate localDate, LocalDate localDate1) {
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }
}
package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ExamResultTimerDTO {
    private Timestamp startTime;
    private Timestamp endTime;

    public ExamResultTimerDTO() {
    }
}

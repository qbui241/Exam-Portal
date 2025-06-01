package com.examportal.server.Request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Setter
@Getter
public class ExamRequest {
    private Long examSessionId;
    private Long id;
    private String name;
    private String description;
    private int totalQuestions;
    private int duration;
    private String subject;
    private Timestamp startDate;
    private Timestamp endDate;
}
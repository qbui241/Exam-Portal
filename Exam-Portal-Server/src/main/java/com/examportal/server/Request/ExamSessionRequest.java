package com.examportal.server.Request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Setter
@Getter
public class ExamSessionRequest {
    private String exam_sessions_description;
    private Timestamp exam_sessions_end_date;
    private String exam_sessions_name;
    private String exam_sessions_password;
    private Timestamp exam_sessions_start_date;

    public ExamSessionRequest() {
    }

    public ExamSessionRequest(String exam_sessions_description, Timestamp exam_sessions_end_date, String exam_sessions_name, String exam_sessions_password, Timestamp exam_sessions_start_date) {
        this.exam_sessions_name = exam_sessions_name;
        this.exam_sessions_description = exam_sessions_description;
        this.exam_sessions_end_date = exam_sessions_end_date;
        this.exam_sessions_name = exam_sessions_name;
        this.exam_sessions_password = exam_sessions_password;
        this.exam_sessions_start_date = exam_sessions_start_date;
    }

}
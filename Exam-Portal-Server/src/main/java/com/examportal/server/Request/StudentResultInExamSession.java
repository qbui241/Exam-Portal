package com.examportal.server.Request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class StudentResultInExamSession {
    private String student_name;
    private Long student_number;
    private String class_name;
    private String exam_name;
    private Float total_score;
    private Timestamp submit_time;

    public StudentResultInExamSession(String student_name, Long student_number, String class_name,
                                      String exam_name, Float total_score, Timestamp submit_time) {
        this.student_name = student_name;
        this.student_number = student_number;
        this.class_name = class_name;
        this.exam_name = exam_name;
        this.total_score = total_score;
        this.submit_time = submit_time;
    }
}

package com.examportal.server.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "exam_results")
public class ExamResult implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "total_score")
    private float totalScore;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "submit_time")
    private Timestamp submitTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "is_submit", columnDefinition = "TINYINT(1)")
    private boolean isSubmit;

    @Column(name = "warning_sent", columnDefinition = "TINYINT(1)", nullable = false)
    private boolean warningSent;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private User user;  // Liên kết tới bảng users

    @ManyToOne
    @JoinColumn(name = "exam_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Exam exam;  // Liên kết tới bảng exams

    // Constructor mặc định (bắt buộc cho JPA)
    public ExamResult() {
    }

    public ExamResult(Long id, float totalScore, Timestamp startTime, Timestamp submitTime, User user, Exam exam) {
        this.id = id;
        this.user = user;
        this.exam = exam;
        this.totalScore = totalScore;
        this.startTime = startTime;
        this.submitTime = submitTime;
    }

    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Long getExamId() {
        return exam != null ? exam.getId() : null;
    }

    public String getExamType() {
        return exam != null ? exam.getType() : null;
    }
}

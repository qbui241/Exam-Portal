package com.examportal.server.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "exam_sessions")
public class ExamSession implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_date", nullable = false)
    private Timestamp startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_date", nullable = false)
    private Timestamp endDate;

    @Column(name = "create_date", nullable = false, updatable = false)
    private Timestamp createDate;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "question_per_exam", length = 30, nullable = false)
    private int questionPerExam = 0;

    @OneToMany
    @JoinColumn(name = "exam_session_id", referencedColumnName = "id")
    @JsonManagedReference
    private Set<ExamSessionEnrollment> examSessionEnrollments;  // Liên kết tới bảng exam_session_enrollments

    public ExamSession() {
    }
}


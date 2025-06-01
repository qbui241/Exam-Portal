package com.examportal.server.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Setter
@Getter
@Entity
@Table(name = "exam_questions")
public class ExamQuestion implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "ordering", nullable = false)
    private int ordering;

    @Column(name = "score", nullable = false)
    private float score;

    // Constructor mặc định (bắt buộc cho JPA)
    public ExamQuestion() {
    }
}

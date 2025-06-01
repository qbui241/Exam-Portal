package com.examportal.server.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "student_answers")
public class StudentAnswer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "answer_id")
    private Long answerId;

    @Column(name = "question_no")
    private int questionNo;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "is_correct")
    private boolean isCorrect;

    @Column(name = "score")
    private float score;

    public StudentAnswer() {
    }

    public StudentAnswer(Long id, Long studentId, Long examId, Long questionId, Long answerId, String answerText, boolean isCorrect, float score, int questionNo) {
        this.id = id;
        this.studentId = studentId;
        this.examId = examId;
        this.questionId = questionId;
        this.answerId = answerId;
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.score = score;
        this.questionNo = questionNo;
    }

}

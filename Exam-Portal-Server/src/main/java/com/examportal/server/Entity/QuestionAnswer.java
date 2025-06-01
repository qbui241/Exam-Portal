package com.examportal.server.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "question_answers")
public class QuestionAnswer implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;


    @JoinColumn(name = "question_id")
    private Long question_id;


    @JoinColumn(name = "exam_id")
    private Long exam_id;

    @Column(name = "question_no")
    private int questionNo;

    @Column(name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answerText;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "ordering", nullable = false)
    private int ordering;

    @Column(name = "source", length = 50)
    private String source;

    public QuestionAnswer() {
    }
}


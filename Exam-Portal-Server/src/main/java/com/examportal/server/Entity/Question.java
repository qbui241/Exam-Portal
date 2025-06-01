package com.examportal.server.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Setter
@Getter
@Entity
@Table(name = "questions")
public class Question implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "exam_session_id", nullable = false)
    private Long examSessionId;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "difficulty", length = 50, nullable = false)
    private String difficulty;

    public Question() {
    }

    public Question(Long id, String content, String difficulty) {
        this.id = id;
        this.content = content;
        this.difficulty = difficulty;
    }

}


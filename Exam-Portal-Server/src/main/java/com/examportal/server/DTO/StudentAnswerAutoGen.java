package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class StudentAnswerAutoGen {
    private Long question_id;
    private Long selected_answer_id;

    public StudentAnswerAutoGen() {
    }

    public StudentAnswerAutoGen(Long question_id, Long selected_answer_id) {
        this.question_id = question_id;
        this.selected_answer_id = selected_answer_id;
    }
}

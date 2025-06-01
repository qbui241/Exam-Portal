package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerAutoGenDTO {
    private Long answer_id;
    private String answer_text;

    public AnswerAutoGenDTO() {
    }

    public AnswerAutoGenDTO(Long answer_id, String answer_text) {
        this.answer_id = answer_id;
        this.answer_text = answer_text;
    }
}

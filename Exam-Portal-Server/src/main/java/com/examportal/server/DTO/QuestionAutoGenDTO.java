package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuestionAutoGenDTO {
    private Long question_id;
    private String question_text;
    private List<AnswerAutoGenDTO> question_answers;

    public QuestionAutoGenDTO() {
    }

    public QuestionAutoGenDTO(Long question_id, String question_text, List<AnswerAutoGenDTO> question_answers) {
        this.question_id = question_id;
        this.question_text = question_text;
        this.question_answers = question_answers;
    }
}

package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExamAutoGenDataDTO {
    private Long exam_id;
    private List<QuestionAutoGenDTO> questions;

    public ExamAutoGenDataDTO() {
    }

    public ExamAutoGenDataDTO(Long exam_id, List<QuestionAutoGenDTO> questions) {
        this.exam_id = exam_id;
        this.questions = questions;
    }
}

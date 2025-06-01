package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadAnswerDTO {
    private int questionNo;
    private String answerText;

    public UploadAnswerDTO(int questionNo, String answerText) {
        this.questionNo = questionNo;
        this.answerText = answerText;
    }

}

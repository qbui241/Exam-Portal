package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UploadExamStateResponseDTO {
    private String message;
    private String endTime;
    private List<AnswerItem> answers;

    public UploadExamStateResponseDTO(String message, String endTime, List<AnswerItem> answers) {
        this.message = message;
        this.endTime = endTime;
        this.answers = answers;
    }

    @Getter
    @Setter
    public static class AnswerItem {
        private int questionNo;
        private String answerText;

        public AnswerItem(int questionNo, String answerText) {
            this.questionNo = questionNo;
            this.answerText = answerText;
        }
    }
}

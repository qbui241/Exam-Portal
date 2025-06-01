package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class UploadStudentAnswerRequest {
    private Long examId;
    private Map<Integer, String> answers;

}

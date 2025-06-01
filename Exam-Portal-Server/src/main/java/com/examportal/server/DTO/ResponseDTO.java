package com.examportal.server.DTO;

public class ResponseDTO {
    private String message;

    public ResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}

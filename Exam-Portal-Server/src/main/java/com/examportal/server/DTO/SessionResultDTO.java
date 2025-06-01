package com.examportal.server.DTO;

public class SessionResultDTO {
    private Long examSessionId;
    private Double averageScore;
    private String sessionName;
    private String teacherFullName;

    public SessionResultDTO(
        Long examSessionId,
        Double averageScore,
        String sessionName,
        String teacherFullName
    ) {
        this.examSessionId = examSessionId;
        this.averageScore = averageScore;
        this.sessionName = sessionName;
        this.teacherFullName = teacherFullName;
    }

    public Long getExamSessionId() {
        return examSessionId;
    }

    public void setExamSessionId(Long examSessionId) {
        this.examSessionId = examSessionId;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public String getSessionName() {
        return sessionName;
    }

    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }

    public String getTeacherFullName() {
        return teacherFullName;
    }

    public void setTeacherFullName(String teacherFullName) {
        this.teacherFullName = teacherFullName;
    }
}

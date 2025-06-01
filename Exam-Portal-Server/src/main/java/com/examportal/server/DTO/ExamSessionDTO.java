package com.examportal.server.DTO;

public class ExamSessionDTO {
    private Long id;
    private Long teacherId;
    private String name;
    private String description;
    private Long startDate;  // Timestamp (milliseconds)
    private Long endDate;    // Timestamp (milliseconds)
    private Long createDate; // Timestamp (milliseconds)
    private String code;
    private String password;
    private String status;

    public ExamSessionDTO() {
    }

    public ExamSessionDTO(Long id, Long teacherId, String name, String description, Long startDate, Long endDate, Long createDate, String code, String password, String type, String status) {
        this.id = id;
        this.teacherId = teacherId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createDate = createDate;
        this.code = code;
        this.password = password;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(Long startDate) {
        this.startDate = startDate;
    }

    public Long getEndDate() {
        return endDate;
    }

    public void setEndDate(Long endDate) {
        this.endDate = endDate;
    }

    public Long getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Long createDate) {
        this.createDate = createDate;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

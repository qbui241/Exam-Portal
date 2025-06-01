package com.examportal.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ExamResultStatusInfo {
    private boolean exists;
    private boolean submitted;
    private boolean expired;
    private boolean aboutToExpire; // sắp hết hạn (còn dưới 5 phút)
    private boolean warningSent;
    private LocalDateTime endTime;
    private String examType;

    public ExamResultStatusInfo() {
        this.exists = false;
        this.submitted = false;
        this.expired = false;
        this.aboutToExpire = false;
        this.warningSent = false;
    }
}

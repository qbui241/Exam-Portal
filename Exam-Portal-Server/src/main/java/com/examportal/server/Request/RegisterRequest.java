package com.examportal.server.Request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
public class RegisterRequest {
    private String name;
    private String className;
    private String schoolName;
    private Date dob;
    private String consious;
    private String email;
    private String password;
    private String repassword;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String className, String schoolName, Date dob, String consious, String email, String password, String repassword) {
        this.name = name;
        this.className = className;
        this.schoolName = schoolName;
        this.dob = dob;
        this.consious = consious;
        this.email = email;
        this.password = password;
        this.repassword = repassword;
    }

}

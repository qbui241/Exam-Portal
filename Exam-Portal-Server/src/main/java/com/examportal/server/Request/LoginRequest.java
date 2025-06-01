package com.examportal.server.Request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    private String username;
    private String password;

    public LoginRequest(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }

    public LoginRequest() {
        super();
        // TODO Auto-generated constructor stub
    }

    // Getters and Setters

}

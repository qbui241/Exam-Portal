package com.examportal.server.Entity;

public class AnswerRequest {
    private String id;
    private String select;

    public AnswerRequest() {
    }

    public AnswerRequest(String select, String id) {
        this.select = select;
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSelect() {
        return select;
    }

    public void setSelect(String select) {
        this.select = select;
    }
}

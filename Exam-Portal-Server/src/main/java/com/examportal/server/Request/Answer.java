package com.examportal.server.Request;

public class Answer {
    private Long id;
    private String select;

    public Answer() {
    }

    public Answer(Long id, String select) {
        this.id = id;
        this.select = select;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSelect() {
        return select;
    }

    public void setSelect(String select) {
        this.select = select;
    }
}

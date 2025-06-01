package com.examportal.server.Service;

import com.examportal.server.Entity.Question;

import java.util.List;

public interface QuestionService {
    List<Question> getList();

    void save(Question question);

    boolean delete(Long id);

    Question update(Question question);

    List<Question> getQuestionsByExamSessionId(Long id);

    Question getQuestionById(Long id);
}

package com.examportal.server.Repositories;

import com.examportal.server.Entity.Question;

import java.util.List;

public interface QuestionRepository {
    List<Question> getList();

    void save(Question question);

    void delete(Long id);

    List<Question> getQuestionsByExamSessionId(Long id);

    void update(Question question);

    Question getQuestionById(Long id);
}

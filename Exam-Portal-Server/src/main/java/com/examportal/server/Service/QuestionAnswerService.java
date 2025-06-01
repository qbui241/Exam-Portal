package com.examportal.server.Service;

import com.examportal.server.Entity.QuestionAnswer;

import java.util.List;

public interface QuestionAnswerService {
    List<QuestionAnswer> getList();

    QuestionAnswer getAnswerById(Long id);

    void save(QuestionAnswer answer);

    void saveAll(List<QuestionAnswer> answers);

    void delete(Long id);

    List<QuestionAnswer> getAnswersByQuestionIdRand(Long questionId);

    void update(Long id, List<QuestionAnswer> answers);
}

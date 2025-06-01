package com.examportal.server.Repositories;

import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Request.ExamSessionRequest;

import java.util.List;

public interface ExamSessionRepository {
    List<ExamSession> getList();

    void save(ExamSession examSession);

    void delete(Long id);

    Long getIdByCode(String code);

    ExamSession getExamSessionById(Long id);

    List<ExamSession> getExamSessionByTeacherId(Long id);

    ExamSession getExamSessionInfo(Long id);

    ExamSession updateExamSessionById(Long id, ExamSessionRequest examSession);

    boolean checkPassword(String password, Long id);
}

package com.examportal.server.Service;

import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Repositories.ExamSessionRepository;
import com.examportal.server.Request.ExamSessionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamSessionServiceImpl implements ExamSessionService {

    @Autowired
    private ExamSessionRepository examSessionRepository;

    @Override
    public List<ExamSession> getList() {
        return examSessionRepository.getList();
    }

    @Override
    public void save(ExamSession examSession) {
        examSessionRepository.save(examSession);
    }

    @Override
    public void delete(Long id) {
        examSessionRepository.delete(id);
    }

    @Override
    public Long getIdByCode(String code) {
        return examSessionRepository.getIdByCode(code);
    }

    @Override
    public ExamSession getExamSessionById(Long id) {
        return examSessionRepository.getExamSessionById(id);
    }

    @Override
    public List<ExamSession> getExamSessionByTeacherId(Long id) {
        return examSessionRepository.getExamSessionByTeacherId(id);
    }

    @Override
    public ExamSession getExamSessionInfo(Long id) {
        return examSessionRepository.getExamSessionInfo(id);
    }

    @Override
    public ExamSession updateExamSessionById(Long id, ExamSessionRequest examSession) {
        return examSessionRepository.updateExamSessionById(id, examSession);
    }

    @Override
    public boolean checkPassword(Long id, String password) {
        return examSessionRepository.checkPassword(password, id);
    }
}

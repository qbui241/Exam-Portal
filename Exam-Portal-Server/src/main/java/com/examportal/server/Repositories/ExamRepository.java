package com.examportal.server.Repositories;

import com.examportal.server.Entity.Exam;
import com.examportal.server.Entity.ExamSession;

import java.util.List;

public interface ExamRepository {
    List<Exam> getList();

    Exam getExamById(Long id);

    void save(Exam exam);

    void delete(Long id);

    List<Exam> getExamBySessionId(Long id);

    List<ExamSession> getTodayExams(Long userId);

    List<Exam> getUnfinishedExams(Long userId);
}


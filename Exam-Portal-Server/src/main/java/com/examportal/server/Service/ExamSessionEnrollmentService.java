package com.examportal.server.Service;

import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Entity.ExamSessionEnrollment;
import com.examportal.server.Request.StudentInExamSessionEnrollmentRequest;

import java.util.List;

public interface ExamSessionEnrollmentService {
    List<ExamSessionEnrollment> getList();

    ExamSessionEnrollment getExamSessionEnrollment(Long id);

    void save(ExamSessionEnrollment examSessionEnrollment);

    void delete(Long id);

    List<StudentInExamSessionEnrollmentRequest> getInfoStudentInExamSessionEnrollment(Long examSessionId);

    void joinExamSessionEnrollment(String examCode, Long userId);

    List<ExamSession> getExamSessionByStudentId(Long studentId);
}

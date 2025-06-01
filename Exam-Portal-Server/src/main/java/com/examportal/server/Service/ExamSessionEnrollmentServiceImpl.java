package com.examportal.server.Service;

import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Entity.ExamSessionEnrollment;
import com.examportal.server.Repositories.ExamSessionEnrollmentRepository;
import com.examportal.server.Request.StudentInExamSessionEnrollmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExamSessionEnrollmentServiceImpl implements ExamSessionEnrollmentService {
    @Autowired
    private ExamSessionEnrollmentRepository ExamSessionEnrollmentRepository;

    @Autowired
    private ExamSessionService examSessionService;

    @Override
    public List<ExamSessionEnrollment> getList() {
        return ExamSessionEnrollmentRepository.getList();
    }

    @Override
    public ExamSessionEnrollment getExamSessionEnrollment(Long id) {
        return ExamSessionEnrollmentRepository.getExamSessionEnrollment(id);
    }

    @Override
    public void save(ExamSessionEnrollment examSessionEnrollment) {
        ExamSessionEnrollmentRepository.save(examSessionEnrollment);
    }

    @Override
    public void delete(Long id) {
        ExamSessionEnrollmentRepository.delete(id);
    }

    @Override
    public List<StudentInExamSessionEnrollmentRequest> getInfoStudentInExamSessionEnrollment(Long examSessionId) {
        return ExamSessionEnrollmentRepository.getInfoStudentInExamSessionEnrollment(examSessionId);
    }

    @Override
    @Transactional
    public void joinExamSessionEnrollment(String examCode, Long userId) {
        Long examSessionId = examSessionService.getIdByCode(examCode);

        if (examSessionId == null) {
            throw new IllegalStateException("Không tìm thấy kỳ thi với mã này");
        }

        boolean hasJoined = ExamSessionEnrollmentRepository.checkJoinExamSessionEnrollment(examSessionId, userId);
        if (hasJoined) {
            throw new IllegalStateException("Học sinh đã tham gia kỳ thi này rồi");
        }

        ExamSessionEnrollmentRepository.joinExamSessionEnrollment(examSessionId, userId);
    }

    @Override
    public List<ExamSession> getExamSessionByStudentId(Long studentId) {
        return ExamSessionEnrollmentRepository.getExamSessionByStudentId(studentId);
    }
}

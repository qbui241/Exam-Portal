package com.examportal.server.Service;

import com.examportal.server.DTO.ExamResultStatusInfo;
import com.examportal.server.DTO.SessionResultDTO;
import com.examportal.server.Entity.ExamResult;
import com.examportal.server.Repositories.ExamResultRepository;
import com.examportal.server.Request.StudentResultInExamSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamResultServiceImpl implements ExamResultService {

    @Autowired
    private ExamResultRepository examResultRepository;

    @Override
    public List<ExamResult> getList() {
        return examResultRepository.getList();
    }

    @Override
    public ExamResult getExamResultById(Long id) {
        return examResultRepository.getExamResultById(id);
    }

    @Override
    public void save(ExamResult examResult) {
        examResultRepository.save(examResult);
    }

    @Override
    public void delete(Long id) {
        examResultRepository.delete(id);
    }

    @Override
    public List<StudentResultInExamSession> getListStudentResultInExamSession(Long examSessionId) {
        return examResultRepository.getListStudentResultInExamSession(examSessionId);
    }

    @Override
    public ExamResult getExamResultByExamIdAndUserId(Long examId, Long userId) {
        return examResultRepository.getExamResultByExamIdAndUserId(examId, userId);
    }

    @Override
    public ExamResultStatusInfo checkExamResultStatus(Long examId, Long userId) {
        ExamResultStatusInfo statusInfo = new ExamResultStatusInfo();

        // Lấy ExamResult từ repository
        ExamResult examResult = examResultRepository.getExamResultByExamIdAndUserId(examId, userId);

        if (examResult == null) {
            return statusInfo; // Mặc định exists = false
        }

        // Thiết lập thông tin trạng thái
        statusInfo.setExists(true);
        statusInfo.setSubmitted(examResult.isSubmit());
        statusInfo.setExamType(examResult.getExamType());
        statusInfo.setWarningSent(examResult.isWarningSent());

        // Chuyển đổi từ java.sql.Timestamp sang LocalDateTime
        LocalDateTime endTime = examResult.getEndTime().toLocalDateTime();
        statusInfo.setEndTime(endTime);

        // Kiểm tra xem bài thi đã hết hạn chưa
        LocalDateTime now = LocalDateTime.now();
        statusInfo.setExpired(now.isAfter(endTime));

        // Kiểm tra xem bài thi sắp hết hạn không (còn 5 phút)
        statusInfo.setAboutToExpire(
                now.isBefore(endTime) &&
                        now.isAfter(endTime.minusMinutes(5)) &&
                        !statusInfo.isWarningSent()
        );

        return statusInfo;
    }

    @Override
    public List<SessionResultDTO> getListSessionResultByUserId(Long userId) {
        return examResultRepository.getListSessionResultByUserId(userId);
    }
}

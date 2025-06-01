package com.examportal.server.Repositories;

import com.examportal.server.Entity.ExamResult;
import com.examportal.server.Request.StudentResultInExamSession;
import com.examportal.server.DTO.SessionResultDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface ExamResultRepository {
    List<ExamResult> getList();

    ExamResult getExamResultById(Long id);

    void save(ExamResult examResult);

    void delete(Long id);

    List<StudentResultInExamSession> getListStudentResultInExamSession(Long examSessionId);

    void newExamResult(Long examId, Long userId);

    ExamResult getExamResultByExamIdAndUserId(Long examId, Long userId); // Thêm phương thức này để lấy ExamResult theo examId và userId

    String getEndTimeExamResultByExamIdAndUserId(Long examId, Long userId);

    void submitUploadExam(Long examId, Long userId, float score);

    // các hàm phục vụ cho check bài thi realtime

    // Tìm các bài thi chưa nộp, chưa gửi cảnh báo, và còn <= 5 phút
    List<ExamResult> findExamsForWarning(LocalDateTime now, LocalDateTime fiveMinutesFromNow);

    // Tìm các bài thi chưa nộp và đã hết giờ (ví dụ: hết giờ trong vòng 1 phút vừa qua để tránh xử lý lại)
    List<ExamResult> findExpiredExams(LocalDateTime now, LocalDateTime oneMinuteAgo);

    // Tìm các bài thi chưa nộp và đã hết giờ (phiên bản đơn giản hơn)
    List<ExamResult> findExpiredExamsSimple(LocalDateTime now);

    List<SessionResultDTO> getListSessionResultByUserId(Long userId);
}

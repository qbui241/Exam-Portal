package com.examportal.server.Service;

import com.examportal.server.DTO.UploadStudentAnswerRequest;
import com.examportal.server.Entity.StudentAnswer;

import java.util.List;

public interface StudentAnswerService {
    List<StudentAnswer> getList();

    StudentAnswer getStudentAnswerById(Long id);

    void save(StudentAnswer student_answer);

    void delete(Long id);

    void saveUploadStudentAnswers(UploadStudentAnswerRequest request, Long userId);

    List<StudentAnswer> getStudentAnswers(Long examId, Long studentId);

    StudentAnswer findStudentAnswerAutogen(Long studentId, Long examId, long questionId);
}

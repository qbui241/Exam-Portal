package com.examportal.server.Repositories;

import com.examportal.server.Entity.StudentAnswer;

import java.util.List;

public interface StudentAnswerRepository {
    List<StudentAnswer> getList();

    StudentAnswer getStudentAnswerById(Long id);

    void save(StudentAnswer student_answer);

    void delete(Long id);

    StudentAnswer findExitingUploadAnswer(Long studentId, Long examId, int questionNo);

    StudentAnswer findStudentAnswerAutogen(Long studentId, Long examId, long questionId);

    List<StudentAnswer> getStudentAnswers(Long examId, Long studentId);

    void saveAll(List<StudentAnswer> studentAnswers);
}

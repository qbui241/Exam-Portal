package com.examportal.server.Service;

import com.examportal.server.DTO.UploadStudentAnswerRequest;
import com.examportal.server.Entity.ExamResult;
import com.examportal.server.Entity.StudentAnswer;
import com.examportal.server.Repositories.ExamResultRepository;
import com.examportal.server.Repositories.StudentAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StudentAnswerServiceImpl implements StudentAnswerService {

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Override
    public List<StudentAnswer> getList() {
        return studentAnswerRepository.getList();
    }

    @Override
    public StudentAnswer getStudentAnswerById(Long id) {
        return studentAnswerRepository.getStudentAnswerById(id);
    }

    @Override
    public void save(StudentAnswer student_answer) {
        studentAnswerRepository.save(student_answer);
    }

    @Override
    public void delete(Long id) {
        studentAnswerRepository.delete(id);
    }

    @Override
    public void saveUploadStudentAnswers(UploadStudentAnswerRequest request, Long userId) {
        Long examId = request.getExamId();

        // 1. Tìm kết quả thi theo examId và userId
        ExamResult examResult = examResultRepository.getExamResultByExamIdAndUserId(examId, userId);

        if (examResult == null) {
            throw new RuntimeException("Exam result not found for exam ID: " + examId + " and user ID: " + userId);
        }

        // 2. Kiểm tra đã nộp bài chưa
        if (examResult.isSubmit()) {
            throw new RuntimeException("You have already submitted the exam.");
        }

        // 3. Kiểm tra thời gian kết thúc bài thi
        if (examResult.getEndTime().getTime() < System.currentTimeMillis()) {
            throw new RuntimeException("Exam time has expired.");
        }

        // 4. Lưu hoặc cập nhật đáp án
        Map<Integer, String> answers = request.getAnswers();
        for (Map.Entry<Integer, String> entry : answers.entrySet()) {
            Integer questionNo = entry.getKey();
            String answerText = entry.getValue();

            // Kiểm tra xem đã tồn tại câu trả lời chưa
            StudentAnswer existingAnswer = studentAnswerRepository.findExitingUploadAnswer(userId, examId, questionNo);

            if (existingAnswer != null) {
                // Nếu đã tồn tại, cập nhật câu trả lời
                existingAnswer.setAnswerText(answerText);
                studentAnswerRepository.save(existingAnswer);
            } else {
                // Nếu chưa có, tạo mới
                StudentAnswer newAnswer = new StudentAnswer();
                newAnswer.setExamId(examId);
                newAnswer.setStudentId(userId);
                newAnswer.setQuestionNo(questionNo);
                newAnswer.setAnswerText(answerText);
                studentAnswerRepository.save(newAnswer);
            }
        }
    }

    @Override
    public List<StudentAnswer> getStudentAnswers(Long examId, Long studentId) {
        return studentAnswerRepository.getStudentAnswers(examId, studentId);
    }

    @Override
    public StudentAnswer findStudentAnswerAutogen(Long studentId, Long examId, long questionId) {
        return studentAnswerRepository.findStudentAnswerAutogen(studentId, examId, questionId);
    }

}

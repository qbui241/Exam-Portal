package com.examportal.server.Service;

import com.examportal.server.Entity.Exam;
import com.examportal.server.Entity.ExamQuestion;
import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Entity.Question;
import com.examportal.server.Repositories.ExamQuestionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamQuestionServiceImpl implements ExamQuestionService {

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private ExamSessionService examSessionService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void generateExamQuestions(Long examId, int questionsPerSet) {
        // Lấy exam để truy ra examSessionId
        Exam exam = entityManager.find(Exam.class, examId);
        if (exam == null) {
            throw new IllegalArgumentException("Exam not found");
        }

        String examSessionId = String.valueOf(exam.getExamSessionId());

        examQuestionRepository.deleteByExamId(examId);

        // Lấy câu hỏi theo examSessionId
        List<Question> questions = entityManager.createQuery("SELECT q FROM Question q WHERE q.examSessionId = :examSessionId ORDER BY RAND() LIMIT :limit", Question.class)
                .setParameter("examSessionId", examSessionId)
                .setParameter("limit", questionsPerSet)
                .getResultList();

        for (int order = 0; order < questions.size(); order++) {
            Question question = questions.get(order);
            ExamQuestion examQuestion = new ExamQuestion();
            examQuestion.setExamId(examId);
            examQuestion.setQuestionId(question.getId());
            examQuestion.setOrdering(order + 1);
            examQuestionRepository.save(examQuestion);
        }
    }

    @Override
    public List<ExamQuestion> getList() {
        return List.of();
    }

    @Override
    public ExamQuestion getExamQuestionById(Long id) {
        return null;
    }

    @Override
    public void save(ExamQuestion examQuestion) {

    }

    @Override
    public void delete(ExamQuestion examQuestion) {

    }

    @Override
    public List<ExamQuestion> getExamQuestionsByExamIdRandOrder(Long examId) {
        // Implementation to retrieve exam questions by exam ID in random order
        List<ExamQuestion> examQuestions = examQuestionRepository.getExamQuestionsByExamIdRandOrder(examId);
        if (examQuestions.isEmpty()) {
            throw new IllegalArgumentException("No questions found for the given exam ID");
        }
        // Process the retrieved questions as needed
        return examQuestions;
    }

    @Override
    public void regenerateExamQuestions(Long Id) {
        try {
            ExamSession examSession = examSessionService.getExamSessionById(Id);
            if (examSession == null) {
                throw new IllegalArgumentException("Exam session not found");
            }
            List<Exam> exams = entityManager.createQuery("SELECT e FROM Exam e WHERE e.examSessionId = :examSessionId AND e.type = 'auto-generate'", Exam.class)
                    .setParameter("examSessionId", examSession.getId())
                    .getResultList();

            if (exams.isEmpty()) {
                throw new IllegalStateException("No auto-generate exams found for session ID: " + Id);
            }

            for (Exam exam : exams) {
                // Xóa các câu hỏi cũ
                examQuestionRepository.deleteByExamId(exam.getId());
                // Tạo mới các câu hỏi cho mỗi exam
                generateExamQuestions(exam.getId(), exam.getTotalQuestions());
            }
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error regenerating exam questions: " + e.getMessage());
            e.printStackTrace();
            // Rethrow to notify caller
            throw new RuntimeException("Failed to regenerate exam questions: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExamQuestion> getExamQuestionsByExamId(Long examId) {
        return examQuestionRepository.getExamQuestionsByExamId(examId);
    }
}
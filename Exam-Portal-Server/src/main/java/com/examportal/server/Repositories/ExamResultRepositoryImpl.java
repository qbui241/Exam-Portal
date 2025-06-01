package com.examportal.server.Repositories;

import com.examportal.server.Entity.Exam;
import com.examportal.server.Entity.ExamResult;
import com.examportal.server.Entity.User;
import com.examportal.server.Request.StudentResultInExamSession;
import com.examportal.server.DTO.SessionResultDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public class ExamResultRepositoryImpl implements ExamResultRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ExamResult> getList() {
        String hql = "FROM ExamResult";
        return entityManager.createQuery(hql, ExamResult.class).getResultList();
    }

    @Override
    public ExamResult getExamResultById(Long id) {
        return entityManager.find(ExamResult.class, id);
    }

    @Override
    public ExamResult getExamResultByExamIdAndUserId(Long examId, Long userId) {
        String hql = "FROM ExamResult er WHERE er.exam.id = :examId AND er.user.id = :userId";
        List<ExamResult> results = entityManager.createQuery(hql, ExamResult.class)
                .setParameter("examId", examId)
                .setParameter("userId", userId)
                .getResultList();

        return results.isEmpty() ? null : results.getFirst();
    }


    @Override
    public void save(ExamResult examResult) {
        try {
            if (examResult.getId() == null) {
                entityManager.persist(examResult);
            } else {
                entityManager.merge(examResult);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public void delete(Long id) {
        entityManager.remove(entityManager.find(ExamResult.class, id));
    }

    @Override
    public List<StudentResultInExamSession> getListStudentResultInExamSession(Long examSessionId) {
        String jpql = "SELECT new com.examportal.server.Request.StudentResultInExamSession( " +
                "u.fullName, u.studentNumber, u.className, e.name, er.totalScore, er.submitTime) " +
                "FROM ExamResult er " +
                "JOIN er.user u " +
                "JOIN er.exam e " +
                "WHERE e.examSessionId = :examSessionId";

        return entityManager.createQuery(jpql, StudentResultInExamSession.class)
                .setParameter("examSessionId", examSessionId)
                .getResultList();
    }

    @Override
    @Transactional
    public void newExamResult(Long examId, Long userId) {
        String jpql = "SELECT er FROM ExamResult er WHERE er.exam.id = :examId AND er.user.id = :userId";
        List<ExamResult> results = entityManager.createQuery(jpql, ExamResult.class)
                .setParameter("examId", examId)
                .setParameter("userId", userId)
                .getResultList();

        if (!results.isEmpty()) {
            return;
        }

        // Lấy thông tin exam và user từ database
        Exam exam = entityManager.find(Exam.class, examId);
        User user = entityManager.find(User.class, userId);

        if (exam == null || user == null) {
            throw new IllegalArgumentException("Exam hoặc User không tồn tại.");
        }

        Timestamp startTime = new Timestamp(System.currentTimeMillis());
        long endTimeMillis = startTime.getTime() + (exam.getDuration() * 60 * 1000L); // duration là phút
        Timestamp endTime = new Timestamp(endTimeMillis);

        ExamResult examResult = new ExamResult();
        examResult.setExam(exam);
        examResult.setUser(user);
        examResult.setStartTime(startTime);
        examResult.setEndTime(endTime);

        entityManager.persist(examResult);

    }

    @Override
    public String getEndTimeExamResultByExamIdAndUserId(Long examId, Long userId) {
        String hql = "SELECT er.endTime FROM ExamResult er WHERE er.exam.id = :examId AND er.user.id = :userId";
        List<Timestamp> results = entityManager.createQuery(hql, Timestamp.class)
                .setParameter("examId", examId)
                .setParameter("userId", userId)
                .getResultList();

        return results.isEmpty() ? "" : results.getFirst().toString();
    }

    @Override
    public void submitUploadExam(Long examId, Long userId, float score) {
        try {
            ExamResult result = getExamResultByExamIdAndUserId(examId, userId);
            if (result != null) {
                result.setSubmitTime(new Timestamp(System.currentTimeMillis()));
                result.setSubmit(true);
                result.setTotalScore(score);
                save(result);
            } else {
                throw new RuntimeException("Không tìm thấy bài thi của sinh viên.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật kết quả bài thi: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExamResult> findExamsForWarning(LocalDateTime now, LocalDateTime fiveMinutesFromNow) {
        String jpql = "SELECT er FROM ExamResult er WHERE er.isSubmit = false AND er.warningSent = false AND er.endTime BETWEEN :now AND :fiveMinutesFromNow";
        TypedQuery<ExamResult> query = entityManager.createQuery(jpql, ExamResult.class);
        query.setParameter("now", now);
        query.setParameter("fiveMinutesFromNow", fiveMinutesFromNow);
        return query.getResultList();
    }

    @Override
    public List<ExamResult> findExpiredExams(LocalDateTime now, LocalDateTime oneMinuteAgo) {
        String jpql = "SELECT er FROM ExamResult er WHERE er.isSubmit = false AND er.endTime <= :now AND er.endTime > :oneMinuteAgo";
        TypedQuery<ExamResult> query = entityManager.createQuery(jpql, ExamResult.class);
        query.setParameter("now", now);
        query.setParameter("oneMinuteAgo", oneMinuteAgo);
        return query.getResultList();
    }

    @Override
    public List<ExamResult> findExpiredExamsSimple(LocalDateTime now) {
        String jpql = "SELECT er FROM ExamResult er WHERE er.isSubmit = false AND er.endTime <= :now";
        TypedQuery<ExamResult> query = entityManager.createQuery(jpql, ExamResult.class);
        query.setParameter("now", now);
        return query.getResultList();
    }

    @Override
    public List<SessionResultDTO> getListSessionResultByUserId(Long userId) {
        String jpql = "SELECT new com.examportal.server.DTO.SessionResultDTO(" +
            "es.id, AVG(er.totalScore), es.name, u.fullName) " +
            "FROM ExamResult er " +
            "JOIN er.exam e " +
            "JOIN ExamSession es ON e.examSessionId = es.id " +
            "JOIN User u ON es.teacherId = u.id " +
            "WHERE er.user.id = :userId " +
            "GROUP BY es.id, es.name, u.fullName";
        return entityManager.createQuery(jpql, SessionResultDTO.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}

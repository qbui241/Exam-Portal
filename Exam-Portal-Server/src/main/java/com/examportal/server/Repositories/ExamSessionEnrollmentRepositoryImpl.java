package com.examportal.server.Repositories;

import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Entity.ExamSessionEnrollment;
import com.examportal.server.Entity.User;
import com.examportal.server.Request.StudentInExamSessionEnrollmentRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Repository
@Transactional
public class ExamSessionEnrollmentRepositoryImpl implements ExamSessionEnrollmentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ExamSessionEnrollment> getList() {
        String hql = "From ExamSessionEnrollment";
        return entityManager.createQuery(hql, ExamSessionEnrollment.class).getResultList();
    }

    @Override
    public ExamSessionEnrollment getExamSessionEnrollment(Long id) {
        return entityManager.find(ExamSessionEnrollment.class, id);
    }

    @Override
    public void save(ExamSessionEnrollment examSessionEnrollment) {

        try {
            if (examSessionEnrollment.getId() == null) {
                entityManager.persist(examSessionEnrollment);
            } else {
                entityManager.merge(examSessionEnrollment);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(Long id) {

        entityManager.remove(entityManager.find(ExamSessionEnrollment.class, id));
    }

    @Override
    public List<StudentInExamSessionEnrollmentRequest> getInfoStudentInExamSessionEnrollment(Long examSessionId) {
        String jpql = "SELECT e.user FROM ExamSessionEnrollment e WHERE e.examSession.id = :examSessionId";

        List<User> users = entityManager.createQuery(jpql, User.class)
                .setParameter("examSessionId", examSessionId)
                .getResultList();

        List<StudentInExamSessionEnrollmentRequest> studentInfoList = new ArrayList<>();
        for (User user : users) {
            StudentInExamSessionEnrollmentRequest studentInfo = new StudentInExamSessionEnrollmentRequest();
            studentInfo.setStudent_number(user.getStudentNumber());
            studentInfo.setClass_name(user.getClassName());
            studentInfo.setStudent_name(user.getFullName());
            studentInfoList.add(studentInfo);
        }

        return studentInfoList;
    }

    @Override
    public void joinExamSessionEnrollment(Long examSessionId, Long userId) {
        ExamSession examSession = entityManager.find(ExamSession.class, examSessionId);
        User user = entityManager.find(User.class, userId);

        if (examSession == null || user == null) {
            throw new IllegalArgumentException("ExamSession hoặc User không tồn tại");
        }

        ExamSessionEnrollment enrollment = new ExamSessionEnrollment();
        enrollment.setExamSession(examSession);
        enrollment.setUser(user);
        enrollment.setEnrollDate(Timestamp.from(Instant.now()));

        entityManager.persist(enrollment);
    }

    @Override
    public boolean checkJoinExamSessionEnrollment(Long examSessionId, Long userId) {
        String hql = "SELECT COUNT(e) FROM ExamSessionEnrollment e WHERE e.examSession.id = :examSessionId AND e.user.id = :userId";
        Long count = entityManager.createQuery(hql, Long.class)
                .setParameter("examSessionId", examSessionId)
                .setParameter("userId", userId)
                .getSingleResult();

        return count > 0;
    }

    @Override
    public List<ExamSession> getExamSessionByStudentId(Long studentId) {
        String hql = "SELECT e.examSession FROM ExamSessionEnrollment e WHERE e.user.id = :studentId";
        return entityManager.createQuery(hql, ExamSession.class)
                .setParameter("studentId", studentId)
                .getResultList();
    }
}

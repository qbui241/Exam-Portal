package com.examportal.server.Repositories;

import com.examportal.server.Entity.Exam;
import com.examportal.server.Entity.ExamSession;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class ExamRepositoryImpl implements ExamRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Exam> getList() {
        String hql = "FROM Exam";
        return entityManager.createQuery(hql, Exam.class).getResultList();
    }

    @Override
    public Exam getExamById(Long id) {
        return entityManager.find(Exam.class, id);
    }

    @Override
    public void save(Exam exam) {
        try {
            if (exam.getId() == null) {
                entityManager.persist(exam);
            } else {
                entityManager.merge(exam);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(entityManager.find(Exam.class, id));
    }

    @Override
    public List<Exam> getExamBySessionId(Long id) {
        String hql = "FROM Exam e WHERE e.examSessionId = :id";
        return entityManager.createQuery(hql, Exam.class).setParameter("id", id).getResultList();
    }

    @Override
    public List<ExamSession> getTodayExams(Long userId) {
        String hql = "From ExamSession es " +
                "Join Exam ex on ex.examSessionId = es.id " +
                "Join ExamSessionEnrollment ese on es.id = ese.examSession.id " +
                " where ese.user.id = :userId and ex.startDate <= current_timestamp " +
                "and ex.endDate >= current_timestamp";
        return entityManager.createQuery(hql, ExamSession.class)
                .setParameter("userId", userId)
                .getResultList();
    }
    @Override
    public List<Exam> getUnfinishedExams(Long userId) {
        String hql = "FROM Exam ex " +
                "JOIN ExamSessionEnrollment ese ON ex.examSessionId = ese.examSession.id AND ese.user.id = :userId " +
                "LEFT JOIN ExamResult er ON er.exam.id = ex.id AND er.user.id = :userId " +
                "WHERE er.id IS NULL";

        return entityManager.createQuery(hql, Exam.class)
                .setParameter("userId", userId)
                .getResultList();
    }



}

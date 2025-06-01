package com.examportal.server.Repositories;

import com.examportal.server.Entity.ExamQuestion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class ExamQuestionRepositoryImpl implements ExamQuestionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(ExamQuestion examQuestion) {
        if (examQuestion.getId() == null) {
            entityManager.persist(examQuestion);
        } else {
            entityManager.merge(examQuestion);
        }
    }

    @Override
    public List<ExamQuestion> getExamQuestionsByExamIdRandOrder(Long examId) {
        String hql = "FROM ExamQuestion eq WHERE eq.examId = :examId ORDER BY RAND()";
        TypedQuery<ExamQuestion> query = entityManager.createQuery(hql, ExamQuestion.class);
        query.setParameter("examId", Long.valueOf(examId));
        return query.getResultList();
    }

    @Override
    public List<ExamQuestion> getExamQuestionsByExamId(Long examId) {
        String hql = "FROM ExamQuestion eq WHERE eq.examId = :examId ";
        TypedQuery<ExamQuestion> query = entityManager.createQuery(hql, ExamQuestion.class);
        query.setParameter("examId", examId);
        return query.getResultList();
    }

    @Override
    public void deleteByExamId(Long examId) {
        String hql = "DELETE FROM ExamQuestion eq WHERE eq.examId = :examId";
        entityManager.createQuery(hql)
                .setParameter("examId", Long.valueOf(examId))
                .executeUpdate();
    }
}
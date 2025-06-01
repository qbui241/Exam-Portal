package com.examportal.server.Repositories;

import com.examportal.server.Entity.Question;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class QuestionRepositoryImpl implements QuestionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Question> getList() {
        String hql = "FROM Question";
        return entityManager.createQuery(hql, Question.class).getResultList();
    }

    @Override
    public void save(Question question) {
        try {
            if (question.getId() == null) {
                entityManager.persist(question);
            } else {
                entityManager.merge(question);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(entityManager.find(Question.class, id));
    }

    @Override
    public List<Question> getQuestionsByExamSessionId(Long id) {
        String hql = "FROM Question q WHERE q.examSessionId = :id";
        return entityManager.createQuery(hql, Question.class)
                .setParameter("id", id)
                .getResultList();
    }

    @Override
    public void update(Question question) {
        try {
            entityManager.merge(question);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Question getQuestionById(Long id) {
        return entityManager.find(Question.class, id);
    }
}

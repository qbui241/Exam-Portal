package com.examportal.server.Repositories;

import com.examportal.server.DTO.UploadAnswerDTO;
import com.examportal.server.Entity.QuestionAnswer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class QuestionAnswerRepositoryImpl implements QuestionAnswerRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<QuestionAnswer> getList() {
        String hql = "FROM QuestionAnswer";
        return entityManager.createQuery(hql, QuestionAnswer.class).getResultList();

    }

    @Override
    public QuestionAnswer getAnswerById(Long id) {
        return entityManager.find(QuestionAnswer.class, id);
    }


    @Override
    public void save(QuestionAnswer answer) {
        try {
            if (answer.getId() == null) {
                entityManager.persist(answer);
            } else {
                entityManager.merge(answer);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Long id) {
        QuestionAnswer answer = entityManager.find(QuestionAnswer.class, id);
        entityManager.remove(answer);
    }

    @Override
    public void deleteByExamId(Long examId) {
        entityManager.createQuery("DELETE FROM QuestionAnswer qa WHERE qa.exam_id = :examId")
                .setParameter("examId", examId)
                .executeUpdate();
    }

    @Override
    public List<QuestionAnswer> getAnswersByQuestionIdRand(Long questionId) {
        String hql = "FROM QuestionAnswer WHERE question_id = :questionId ORDER BY RAND()";
        return entityManager.createQuery(hql, QuestionAnswer.class)
                .setParameter("questionId", questionId)
                .getResultList();
    }

    @Override
    public List<UploadAnswerDTO> getUploadExamAnswer(Long examId) {
        try {
            return entityManager.createQuery(
                            "SELECT new com.examportal.server.DTO.UploadAnswerDTO(q.questionNo, q.answerText) " +
                                    "FROM QuestionAnswer q " +
                                    "WHERE q.exam_id = :examId AND q.isCorrect = true", UploadAnswerDTO.class)
                    .setParameter("examId", examId)
                    .getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi truy vấn câu trả lời đúng của bài thi: " + e.getMessage(), e);
        }
    }
}

package com.examportal.server.Repositories;

import com.examportal.server.Entity.StudentAnswer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class StudentAnswerRepositoryImpl implements StudentAnswerRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<StudentAnswer> getList() {
        String hql = "FROM StudentAnswer";
        return entityManager.createQuery(hql, StudentAnswer.class).getResultList();
    }

    @Override
    public StudentAnswer findExitingUploadAnswer(Long studentId, Long examId, int questionNo) {
        try {
            return entityManager.createQuery(
                            "SELECT a FROM StudentAnswer a WHERE a.studentId = :studentId AND a.examId = :examId AND a.questionNo = :questionNo",
                            StudentAnswer.class)
                    .setParameter("studentId", studentId)
                    .setParameter("examId", examId)
                    .setParameter("questionNo", questionNo)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // không tìm thấy bản ghi nào
        }
    }

    @Override
    public StudentAnswer findStudentAnswerAutogen(Long studentId, Long examId, long questionId) {
        try {
            return entityManager.createQuery(
                            "FROM StudentAnswer sa WHERE sa.studentId = :studentId AND sa.examId = :examId AND sa.questionId = :questionId",
                            StudentAnswer.class)
                    .setParameter("studentId", studentId)
                    .setParameter("examId", examId)
                    .setParameter("questionId", questionId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // không tìm thấy bản ghi nào
        }
    }

    @Override
    public List<StudentAnswer> getStudentAnswers(Long examId, Long studentId) {
        try {
            return entityManager.createQuery(
                            "SELECT a FROM StudentAnswer a WHERE a.examId = :examId AND a.studentId = :studentId",
                            StudentAnswer.class)
                    .setParameter("examId", examId)
                    .setParameter("studentId", studentId)
                    .getResultList();
        } catch (NoResultException e) {
            return null; // không tìm thấy bản ghi nào
        }
    }

    @Override
    public StudentAnswer getStudentAnswerById(Long id) {
        return entityManager.find(StudentAnswer.class, id);
    }

    @Override
    public void save(StudentAnswer student_answer) {
        try {
            if (student_answer.getId() == null) {
                entityManager.persist(student_answer);
            } else {
                entityManager.merge(student_answer);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void saveAll(List<StudentAnswer> student_answers) {
        try {
            for (StudentAnswer student_answer : student_answers) {
                save(student_answer);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(entityManager.find(StudentAnswer.class, id));
    }
}

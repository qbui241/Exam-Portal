package com.examportal.server.Repositories;

import com.examportal.server.Entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class UserRepositoryImpl implements UserRepositoryCustom {


    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> getList() {
        try {
            String hql = "FROM User";
            return entityManager.createQuery(hql, User.class).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void addOrUpdate(User user) {
        try {
            if (user.getId() != null) {
                entityManager.merge(user);
            } else {
                entityManager.persist(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public User getUserById(int id) {
        try {
            return entityManager.find(User.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteUserByid(int id) {
        try {
            User user = entityManager.find(User.class, id);
            if (user != null) {
                entityManager.remove(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public User getUserbyEmail(String email) {
        List<User> users = entityManager.createQuery("FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getResultList();
        if (users.isEmpty()) {
            return null; // hoặc xử lý theo yêu cầu của bạn
        }
        return users.get(0); // Trả về người dùng đầu tiên trong danh sách
    }

}

package com.examportal.server.Repositories;

import com.examportal.server.Entity.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> getList();

    void addOrUpdate(User user);

    User getUserById(int id);

    void deleteUserByid(int id);

    User getUserbyEmail(String email);
}

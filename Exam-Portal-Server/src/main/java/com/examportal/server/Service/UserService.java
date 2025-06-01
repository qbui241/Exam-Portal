package com.examportal.server.Service;

import com.examportal.server.Entity.User;

import java.util.List;

public interface UserService {
    User getUserByUsername(String username);

    List<User> getList();

    void AddOrUpdate(User user);

    User getUserById(int id);

    void deleteById(int id);

    User getUserByEmail(String email);
}

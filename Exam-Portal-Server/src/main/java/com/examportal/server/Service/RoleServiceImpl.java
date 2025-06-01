package com.examportal.server.Service;

import com.examportal.server.Entity.Role;
import com.examportal.server.Repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRespository;


    @Override
    public Role findByRoleName(String name) {

        return roleRespository.findByName(name);

    }
}

package com.examportal.server.Service;

import com.examportal.server.Entity.Role;

public interface RoleService {
    Role findByRoleName(String name);
}

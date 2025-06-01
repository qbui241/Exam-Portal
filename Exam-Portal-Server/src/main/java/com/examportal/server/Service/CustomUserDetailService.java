package com.examportal.server.Service;

import com.examportal.server.Entity.CustomUserDetails;
import com.examportal.server.Entity.User;
import com.examportal.server.Entity.UserRole;
import com.examportal.server.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAO.findByUsernameWithRoles(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        Collection<GrantedAuthority> grantedAuthoritySet = new HashSet<>();
        Set<UserRole> roles = user.getUserRoles();
        for (UserRole role : roles) {
            grantedAuthoritySet.add(new SimpleGrantedAuthority(role.getRole().getName()));
        }
        return new CustomUserDetails(grantedAuthoritySet, user.getEmail(), user.getFullName(), user.getPassword(), user.getUsername(), user.getGender(), user.getAddress(), user.getTelephone(), user.getEnabled(), true, true, true);
    }
}


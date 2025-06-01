package com.examportal.server.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonManagedReference
    private Set<UserRole> roleUsers;

    public Role(Long id, String name, Set<UserRole> roleUsers) {
        super();
        this.id = id;
        this.name = name;
        this.roleUsers = roleUsers;
    }

    public Role() {
        super();
        // TODO Auto-generated constructor stub
    }

}

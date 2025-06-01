package com.examportal.server.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "student_number")
    private Long studentNumber;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "dob")
    private Date birthday;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")  // Sửa lại tên cho phù hợp với bảng (phone)
    private String telephone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "school")
    private String school;

    @Column(name = "class")
    private String className;

    @Column(name = "status")  // Thêm trường status
    private Integer status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<UserRole> userRoles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<ExamSessionEnrollment> examEnrollments;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<ExamResult> examResults;

    public User() {
    }

    public User(Long id, String username, String password, Boolean enabled, String fullName, Boolean gender, Date birthday, String address, String email, String telephone, String avatarUrl, String school, String className, Integer status, Timestamp createdAt, Timestamp updatedAt, Set<UserRole> userRoles, Long studentNumber) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.fullName = fullName;
        this.gender = gender;
        this.birthday = birthday;
        this.address = address;
        this.email = email;
        this.telephone = telephone;
        this.avatarUrl = avatarUrl;
        this.school = school;
        this.className = className;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userRoles = userRoles;
        this.studentNumber = studentNumber;
    }

}

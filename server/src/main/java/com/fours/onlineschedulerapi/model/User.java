package com.fours.onlineschedulerapi.model;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    private String password;

    @Column(name = "is_tutor", columnDefinition = "boolean default false")
    private Boolean isTutor;

    @Column(name = "is_enabled", columnDefinition = "boolean default true")
    private Boolean isEnabled = true;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private Tutor tutor;

    @Transient
    private String expertise;
}

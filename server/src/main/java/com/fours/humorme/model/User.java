package com.fours.humorme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(length = 1023)
    private String bio;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Column(name = "is_enabled", columnDefinition = "boolean default true")
    private Boolean isEnabled = true;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    // who follow me
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id") // users who are following the current user
    )
    private Set<User> followers = new HashSet<>();

    // who do I follow
    // users whom the current user is following
    @JsonIgnore
    @ManyToMany(mappedBy = "followers")
    private Set<User> followings = new HashSet<>();

    public User(String name, String email, String password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

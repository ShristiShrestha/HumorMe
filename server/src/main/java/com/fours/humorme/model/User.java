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

    public User(String name, String email, String password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

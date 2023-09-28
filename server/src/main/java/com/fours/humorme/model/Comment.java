package com.fours.humorme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @ManyToOne
    @JsonIgnore
    private Joke joke;

    @OneToOne
    private User user; // user who wrote this comment

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    public Comment(String text, Joke joke, User user){
        this.text = text;
        this.joke = joke;
        this.user = user;
    }
}

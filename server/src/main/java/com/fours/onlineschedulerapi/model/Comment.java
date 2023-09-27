package com.fours.onlineschedulerapi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

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
    private Joke joke;

    @OneToOne
    private User user; // user who wrote this comment

    public Comment(String text, Joke joke, User user){
        this.text = text;
        this.joke = joke;
        this.user = user;
    }
}

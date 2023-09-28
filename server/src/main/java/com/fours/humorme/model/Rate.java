package com.fours.humorme.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "joke_rates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    @OneToOne
    private User user;

    @OneToOne
    private Joke joke;

    private String label;

    public Rate(Joke joke,User user, String label){
        this.user = user;
        this.joke = joke;
        this.label = label;
    }
}

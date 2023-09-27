package com.fours.onlineschedulerapi.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "jokes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Joke {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String text;
    private String labels;
    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;
    @ManyToOne
    private User user;

    public Joke(String title, String text, String labels){
        this.title = title;
        this.text = text;
        this.labels = labels;
    }
}

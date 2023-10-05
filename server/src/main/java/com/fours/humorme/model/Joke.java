package com.fours.humorme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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

    @JsonIgnore
    private String ratings;
    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;
    @ManyToOne
    private User user;

    // count number of comments for this joke
    @Column(name="total_comments")
    private Long totalComments;

    public Joke(String title, String text, String labels){
        this.title = title;
        this.text = text;
        this.labels = labels;
    }

    public Map<String, Integer> getLabelRatings() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        try{
            return objectMapper.readValue(this.ratings, new TypeReference<HashMap<String, Integer>>() {});
        }catch (Exception err){
            return new HashMap<>();
        }
    }
}

package com.fours.humorme.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "tutors")
@Getter
@Setter
@NoArgsConstructor
public class Tutor {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.TRUE)
    private User user;

    @Column(columnDefinition = "float default 0.0")
    private float rating;

    @JsonIgnore
    private String expertise;

    @Transient
    private List<String> expertiseList = new ArrayList<>();

    @Column(name = "rated_by", columnDefinition = "integer default 0")
    private Integer ratedBy = 0;

    @Transient
    private Map<Float,Integer> ratingByNumbers;

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public void setExpertiseList(List<String> expertiseList) {
        this.expertiseList = expertiseList;
        StringBuilder expertise = new StringBuilder();

        if (Objects.nonNull(this.expertiseList) && !this.expertiseList.isEmpty()) {
            for (int i = 0; i < expertiseList.size(); i++) {
                expertise.append(expertiseList.get(i));

                if (i != expertiseList.size() - 1) {
                    expertise.append(",");
                }
            }
        }

        this.expertise = expertise.toString();
    }

    public List<String> getExpertiseList() {
        if (this.expertiseList.isEmpty() && Objects.nonNull(this.expertise) && !this.expertise.isEmpty()) {
            this.expertiseList.addAll(Arrays.asList(expertise.split(",")));
        }

        return this.expertiseList;
    }
}

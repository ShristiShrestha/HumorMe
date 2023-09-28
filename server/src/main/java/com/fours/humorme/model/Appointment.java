package com.fours.humorme.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fours.humorme.constants.AppointmentConstant;
import com.fours.humorme.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "tutor_id")
    private Long tutorId;

    private String status =  AppointmentConstant.PENDING;

    @Column(name = "status_message")
    private String statusMessage;

    @Column(name = "student_note")
    private String studentNote;

    @Transient
    private List<String> tutoringOnList = new ArrayList<>();

    @JsonIgnore
    @Column(name = "tutoring_on")
    private String tutoringOnString;

    @Column(name = "scheduled_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = AppointmentConstant.SCHEDULED_AT_FORMAT)
    private Date scheduledAt;

    @Column(name = "client_received_at")
    private Date clientReceivedAt;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Date updatedAt;

    private Float rating = 0F;

    @Transient
    private UserDto tutor;

    @Transient
    private UserDto student;

    public void setTutoringOnList(List<String> tutoringOnList) {
        this.tutoringOnList = tutoringOnList;
        StringBuilder tutoringOnString = new StringBuilder();

        if (Objects.nonNull(this.tutoringOnList) && !this.tutoringOnList.isEmpty()) {
            for (int i = 0; i < tutoringOnList.size(); i++) {
                tutoringOnString.append(tutoringOnList.get(i));

                if (i != tutoringOnList.size() - 1) {
                    tutoringOnString.append(",");
                }
            }
        }

        this.tutoringOnString = tutoringOnString.toString();
    }

    public List<String> getTutoringOnList() {
        if (this.tutoringOnList.isEmpty() && Objects.nonNull(this.tutoringOnString) && !this.tutoringOnString.isEmpty()) {
            this.tutoringOnList.addAll(Arrays.asList(tutoringOnString.split(",")));
        }

        return this.tutoringOnList;
    }
}

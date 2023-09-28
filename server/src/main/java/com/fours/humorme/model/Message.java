package com.fours.humorme.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email
    private String senderEmail;

    @NotNull
    @Email
    private String receiverEmail;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date sentAt;

    @Column(name = "received_at")
    private Date receivedAt;

    @NotNull
    @NotEmpty
    @Column(length = 4000)
    private String message;
}


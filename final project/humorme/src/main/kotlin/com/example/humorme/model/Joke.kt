package com.example.humorme.model

import java.util.Date
import javax.persistence.*

@Entity
data class Joke (
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,

        val title: String,
        val text: String,
        val createdAt : Date,

        @ManyToOne
        val user: User
)
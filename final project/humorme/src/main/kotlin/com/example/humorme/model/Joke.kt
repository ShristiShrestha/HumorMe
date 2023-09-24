package com.example.humorme.model

import java.util.Date
import javax.persistence.*

@Entity
data class Joke (
        @Id
        val id: String,
        val title: String,
        val text: String,
        val createdAt : Date
//        @ManyToOne(fetch = FetchType.LAZY)
//        val user: User
)
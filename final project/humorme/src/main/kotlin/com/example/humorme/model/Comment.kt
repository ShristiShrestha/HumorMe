package com.example.humorme.model
import javax.persistence.*

@Entity
data class Comment (
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,

        val text: String,

        @ManyToOne
        val joke: Joke
)
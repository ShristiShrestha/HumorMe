package com.example.humorme.model
import javax.persistence.*


@Entity
data class Comment (
        @Id
        val id: String,

        val text: String,

        @ManyToOne
        val joke: Joke
)
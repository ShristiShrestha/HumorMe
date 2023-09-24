package com.example.humorme.model

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Entity
data class User (
        @Id
        val id: String,

        val name: String,
        val email: String,
        val passHash: String,
)
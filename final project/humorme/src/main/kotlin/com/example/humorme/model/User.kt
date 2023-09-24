package com.example.humorme.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "users")
data class User (
        @Id
        val id: String,
        val name: String,
        val email: String,
        val passHash: String,
)
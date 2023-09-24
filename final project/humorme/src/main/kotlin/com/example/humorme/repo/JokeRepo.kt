package com.example.humorme.repo

import com.example.humorme.model.Joke
import org.springframework.data.jpa.repository.JpaRepository

interface JokeRepo: JpaRepository<Joke, Long> {
}
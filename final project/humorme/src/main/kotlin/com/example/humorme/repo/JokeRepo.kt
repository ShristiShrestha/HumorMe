package com.example.humorme.repo

import com.example.humorme.model.Joke
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JokeRepo: JpaRepository<Joke, String> {
}
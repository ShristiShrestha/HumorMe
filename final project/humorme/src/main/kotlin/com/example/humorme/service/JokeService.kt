package com.example.humorme.service

import com.example.humorme.dto.PostJokeDto
import com.example.humorme.model.Joke
import com.example.humorme.model.User
import com.example.humorme.repo.JokeRepo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class JokeService @Autowired constructor(
        private val jokeRepo: JokeRepo
) {
    fun create(req: PostJokeDto, user: User): Joke{
        val joke = Joke(
                title = req.title,
                text = req.text,
                createdAt = Date(),
                user = user
        )
        return jokeRepo.save(joke)
    }
}
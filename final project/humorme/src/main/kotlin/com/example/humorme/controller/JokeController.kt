package com.example.humorme.controller

import com.example.humorme.dto.PostJokeDto
import com.example.humorme.model.Joke
import com.example.humorme.service.JokeService
import com.example.humorme.service.UserService
import com.example.humorme.utils.Response
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/jokes")
class JokeController @Autowired constructor(
        private val jokeService: JokeService,
        private val userService: UserService
) {

    @PostMapping
    fun doPost(@RequestBody joke: PostJokeDto): Response<Joke>{
        val user = userService.get()
        val newJoke = jokeService.create(joke, user)
        return Response(payload = newJoke)
    }
}
package com.example.humorme.service

import com.example.humorme.repo.JokeRepo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CommentService @Autowired constructor(
        private val commentRepo: JokeRepo
) {
}
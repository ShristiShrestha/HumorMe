package com.example.humorme.dto

data class JokeDto(
        val title: String,
        val text: String,
        val createdAt: String,
        val user: UserDto
)

data class PostJokeDto(
        val title: String,
        val text: String
)

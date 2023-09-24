package com.example.humorme.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/jokes/{jokeId}/comments")
class CommentController {
}
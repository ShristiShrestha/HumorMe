package com.example.humorme.repo

import org.springframework.data.jpa.repository.JpaRepository
import com.example.humorme.model.Comment

interface CommentRepo: JpaRepository<Comment, Long> {
}
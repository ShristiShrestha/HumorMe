package com.example.humorme.repo

import org.springframework.data.jpa.repository.JpaRepository
import com.example.humorme.model.Comment
import org.springframework.stereotype.Repository

@Repository
interface CommentRepo: JpaRepository<Comment, String> {
}
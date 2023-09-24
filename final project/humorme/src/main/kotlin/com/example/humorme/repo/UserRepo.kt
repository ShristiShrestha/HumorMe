package com.example.humorme.repo
import com.example.humorme.model.User
import org.springframework.data.jpa.repository.JpaRepository;

interface UserRepo:JpaRepository<User, Long> {
}
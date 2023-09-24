package com.example.humorme.repo
import com.example.humorme.model.User
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository

@Repository
interface UserRepo:JpaRepository<User, String> {
}
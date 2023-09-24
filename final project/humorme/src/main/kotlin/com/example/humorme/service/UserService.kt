package com.example.humorme.service

import com.example.humorme.model.User
import com.example.humorme.repo.UserRepo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService@Autowired constructor(
        private val userRepo: UserRepo
)  {

    fun get(): User{
        val users = userRepo.findAll()
        return users[0]
    }
}
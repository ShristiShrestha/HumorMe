package com.example.humorme

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EntityScan(basePackages = arrayOf("com.example.humorme.model"))
@EnableJpaRepositories("com.example.humorme.repo")
class HumormeApplication

fun main(args: Array<String>) {
	runApplication<HumormeApplication>(*args)
}



package com.example.humorme

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication

@SpringBootApplication
@EntityScan(basePackages = arrayOf("com.example.humorme.model"))
class HumormeApplication

fun main(args: Array<String>) {
	runApplication<HumormeApplication>(*args)
}



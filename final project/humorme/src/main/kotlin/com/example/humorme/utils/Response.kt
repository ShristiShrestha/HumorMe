package com.example.humorme.utils

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.*

data class Response<T>(
        var payload: T? = null,

        var error: String? = null,

        @JsonProperty("api_version")
        val apiVersion: String = "v1.0",

        @JsonProperty("response_time")
        val responseTime: Date = Date()

)
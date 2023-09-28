package com.fours.humorme.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("Content-Type", "Authorization", "Cookie", "*")
                        .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Headers",
                                "Access-Control-Allow-Methods"," Access-Control-Request-Headers",
                                "Access-Control-Max-Age", "Access-Control-Expose-Headers", "Content-Type",
                                "Authorization", "Cookie")
                        .allowCredentials(true);
            }
        };
    }
}

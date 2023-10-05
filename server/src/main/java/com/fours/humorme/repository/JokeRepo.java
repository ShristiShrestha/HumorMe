package com.fours.humorme.repository;

import com.fours.humorme.model.Joke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JokeRepo extends JpaRepository<Joke, Long>, JpaSpecificationExecutor<Joke> {
}

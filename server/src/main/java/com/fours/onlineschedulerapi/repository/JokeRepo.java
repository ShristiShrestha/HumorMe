package com.fours.onlineschedulerapi.repository;

import com.fours.onlineschedulerapi.model.Joke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JokeRepo extends JpaRepository<Joke, Long> {
}

package com.fours.onlineschedulerapi.service;

import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.repository.JokeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JokeService {
    @Autowired private JokeRepo jokeRepo;

    public Joke create(Joke joke){
        return jokeRepo.save(joke);
    }
}

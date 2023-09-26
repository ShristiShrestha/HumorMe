package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.model.Appointment;
import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.service.JokeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jokes")
public class JokeController {

    @Autowired private JokeService jokeService;

    @PostMapping
    public ResponseEntity<Joke> save(@RequestBody Joke joke) {
        Joke savedJoke = jokeService.create(joke);
        return ResponseEntity.ok(savedJoke);
    }
}

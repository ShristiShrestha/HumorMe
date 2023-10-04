package com.fours.humorme.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fours.humorme.dto.joke.JokeDto;
import com.fours.humorme.exception.NotAuthorizedException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.Joke;
import com.fours.humorme.model.Rate;
import com.fours.humorme.model.User;
import com.fours.humorme.service.AuthenticatedUserService;
import com.fours.humorme.service.JokeService;
import com.fours.humorme.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jokes")
public class JokeController {
    @Autowired
    AuthenticatedUserService authUserService;
    @Autowired
    private UserService userService;
    @Autowired private JokeService jokeService;


    @PostMapping
    public ResponseEntity<?> post(@RequestBody JokeDto joke) throws NotFoundException {
        User user = userService.getAuthenticatedUser();
        Joke savedJoke = jokeService.create(joke, user);
        return ResponseEntity.ok(savedJoke);
    }

    @DeleteMapping("/{jokeId}")
    public ResponseEntity<?> delete(@PathVariable Long jokeId) throws NotFoundException, NotAuthorizedException {
        User user = userService.getAuthenticatedUser();
        jokeService.delete(jokeId, user);
        return new ResponseEntity<>("Joke has been successfully removed.", HttpStatus.OK);
    }

    @GetMapping("/{jokeId}")
    public ResponseEntity<Joke> get(@PathVariable Long jokeId) throws NotFoundException {
        Joke joke = jokeService.findById(jokeId);
        return new ResponseEntity<>(joke, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Joke>> search(@RequestParam(required = false) String labels) {
        List<Joke> jokes = jokeService.findAll();
        return new ResponseEntity<>(jokes, HttpStatus.OK);
    }

    @PostMapping("/{jokeId}/ratings")
    public ResponseEntity<?> postRating(@PathVariable Long jokeId, @RequestBody String label) throws NotFoundException, JsonProcessingException {
        User user = userService.getAuthenticatedUser();
        Joke joke = jokeService.findById(jokeId);
        Rate rate = jokeService.rate(joke, user, label);
        return new ResponseEntity<>(rate, HttpStatus.OK);
    }

    @DeleteMapping("/{jokeId}/ratings/{jokeRatingId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long jokeId, @PathVariable Long jokeRatingId) throws NotFoundException, JsonProcessingException, NotAuthorizedException {
        User user = userService.getAuthenticatedUser();
        Joke joke = jokeService.findById(jokeId); // making
        joke = jokeService.deleteRating(joke, user, jokeRatingId);
        return new ResponseEntity<>(joke, HttpStatus.OK);
    }

    @GetMapping("/{jokeId}/ratings")
    public ResponseEntity<List<Rate>> getRating(@PathVariable Long jokeId) throws NotFoundException {
        Joke joke = jokeService.findById(jokeId);
        List<Rate> jokeRatings = jokeService.findJokeRatings(joke);
        return new ResponseEntity<>(jokeRatings, HttpStatus.OK);
    }

    @GetMapping("/ratings")
    public ResponseEntity<List<Rate>> getLoggedUserRatings() throws NotFoundException {
        User user = userService.getAuthenticatedUser();
        List<Rate> jokeRatings = jokeService.findMyJokeRatings(user);
        return new ResponseEntity<>(jokeRatings, HttpStatus.OK);
    }
}

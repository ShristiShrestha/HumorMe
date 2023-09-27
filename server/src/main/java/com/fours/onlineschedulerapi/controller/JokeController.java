package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.dto.JokeDto;
import com.fours.onlineschedulerapi.exception.NotAuthorizedException;
import com.fours.onlineschedulerapi.exception.NotFoundException;
import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.model.User;
import com.fours.onlineschedulerapi.service.AuthenticatedUserService;
import com.fours.onlineschedulerapi.service.JokeService;
import com.fours.onlineschedulerapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jokes")
public class JokeController {
    @Autowired
    AuthenticatedUserService authUserService;
    @Autowired
    private UserService userService;
    @Autowired private JokeService jokeService;


    @PostMapping
    public ResponseEntity<?> post(@RequestBody JokeDto joke) {
        try{
            User user = userService.findByName(authUserService.getUsername());
            Joke savedJoke = jokeService.create(joke, user);
            return ResponseEntity.ok(savedJoke);
        }catch (NotFoundException error){
            return new ResponseEntity<>(
                    error.getMessage(), HttpStatus.NOT_FOUND
            );
        }
    }

    @DeleteMapping("/{jokeId}")
    public ResponseEntity<?> delete(@PathVariable Long jokeId) {
        try{
            User user = userService.findByName(authUserService.getUsername());
            jokeService.delete(jokeId, user);
            return new ResponseEntity<>("Joke has been successfully removed.", HttpStatus.OK);
        }catch (NotFoundException error){
            return new ResponseEntity<>(
                    error.getMessage(), HttpStatus.NOT_FOUND
            );
        } catch (NotAuthorizedException error) {
            return new ResponseEntity<>(
                    error.getMessage(), HttpStatus.UNAUTHORIZED
            );
        }
    }
}

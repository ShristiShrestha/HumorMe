package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.exception.NotFoundException;
import com.fours.onlineschedulerapi.model.Comment;
import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.model.User;
import com.fours.onlineschedulerapi.service.AuthenticatedUserService;
import com.fours.onlineschedulerapi.service.CommentService;
import com.fours.onlineschedulerapi.service.JokeService;
import com.fours.onlineschedulerapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jokes/{jokeId}/comments")
public class CommentController {

    @Autowired
    private UserService userService;

    @Autowired
    AuthenticatedUserService authUserService;

    @Autowired
    JokeService jokeService;
    @Autowired private CommentService commentService;

    @PostMapping
    public ResponseEntity<?> post(@PathVariable Long jokeId, @RequestBody String text) throws NotFoundException {
        try{
            User user = userService.findByName(authUserService.getUsername());
            Joke joke = jokeService.getById(jokeId);
            Comment comment = commentService.create(joke, text, user);
            return new ResponseEntity<>(comment, HttpStatus.OK);
        }catch (Exception error){
            return new ResponseEntity<>(error.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{commentId}")
    public void delete(@PathVariable Long jokeId) {}
}

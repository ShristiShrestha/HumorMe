package com.fours.humorme.controller;

import com.fours.humorme.dto.comment.CommentDto;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.Comment;
import com.fours.humorme.model.Joke;
import com.fours.humorme.model.User;
import com.fours.humorme.service.AuthenticatedUserService;
import com.fours.humorme.service.CommentService;
import com.fours.humorme.service.JokeService;
import com.fours.humorme.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> post(@PathVariable Long jokeId, @RequestBody CommentDto commentDto) throws NotFoundException {
        User user = userService.findByName(authUserService.getUsername());
        Joke joke = jokeService.findById(jokeId);
        Comment comment = commentService.create(joke, commentDto.getText(), user);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @DeleteMapping("/{commentId}")
    public void delete(@PathVariable Long jokeId, @PathVariable Long commentId) throws NotFoundException {
        User user = userService.findByName(authUserService.getUsername());
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> get(@PathVariable Long commentId) throws NotFoundException {
        Comment comment = commentService.findById(commentId);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Comment>> search(@PathVariable Long jokeId, @RequestParam(required = false) String labels) throws NotFoundException {
        Joke joke = jokeService.findById(jokeId);
        List<Comment> comments = commentService.findAllByJoke(joke);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}

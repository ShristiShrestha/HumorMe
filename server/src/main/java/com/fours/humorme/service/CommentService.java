package com.fours.humorme.service;

import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.Comment;
import com.fours.humorme.model.Joke;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.CommentRepo;
import com.fours.humorme.repository.JokeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired private CommentRepo commentRepo;
    @Autowired private JokeRepo jokeRepo;

    public Comment create(Joke joke, String text, User user){
     Comment comment = new Comment(text, joke, user);
     comment = commentRepo.save(comment);
     Long existingTotalComments = commentRepo.countAllByJoke(joke);
     joke.setTotalComments(existingTotalComments);
     jokeRepo.save(joke);
     return comment;
    }

    public Comment findById(Long id) throws NotFoundException {
        Optional<Comment> comment = commentRepo.findById(id);
        if(comment.isPresent()){
            return comment.get();
        }
        throw new NotFoundException("Comment with id " + id + " is not found.");
    }

    public List<Comment> findAllByJoke(Joke joke){
        return commentRepo.findAllByJoke(joke);
    }
}

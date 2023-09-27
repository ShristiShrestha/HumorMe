package com.fours.onlineschedulerapi.service;

import com.fours.onlineschedulerapi.model.Comment;
import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.model.User;
import com.fours.onlineschedulerapi.repository.CommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired private CommentRepo commentRepo;
    public Comment create(Joke joke, String text, User user){
     Comment comment = new Comment(text, joke, user);
     return commentRepo.save(comment);
    }
}

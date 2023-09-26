package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jokes/{jokeId}/comments")
public class CommentController {

    @Autowired private CommentService commentService;
}

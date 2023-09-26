package com.fours.onlineschedulerapi.service;

import com.fours.onlineschedulerapi.repository.CommentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired private CommentRepo commentRepo;
}

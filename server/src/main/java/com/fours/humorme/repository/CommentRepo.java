package com.fours.humorme.repository;

import com.fours.humorme.model.Comment;
import com.fours.humorme.model.Joke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {

    List<Comment> findAllByJoke(Joke joke);

    Long countAllByJoke(Joke joke);

    @Transactional
    void deleteCommentsByJoke(Joke joke);
}

package com.fours.humorme.repository;

import com.fours.humorme.model.Joke;
import com.fours.humorme.model.Rate;
import com.fours.humorme.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateRepo extends JpaRepository<Rate, Long> {

    List<Rate> findAllByJoke(Joke joke);

    List<Rate> findAllByUser_Id(Long userId);

    Optional<Rate> findAllByUser_Id_AndJoke_Id(Long userId, Long jokeId);
}

package com.fours.humorme.repository;

import com.fours.humorme.model.Joke;
import com.fours.humorme.model.Rate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateRepo extends JpaRepository<Rate, Long> {

    List<Rate> findAllByJoke(Joke joke);
}

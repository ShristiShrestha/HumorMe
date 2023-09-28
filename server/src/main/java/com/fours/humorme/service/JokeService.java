package com.fours.humorme.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fours.humorme.dto.JokeDto;
import com.fours.humorme.exception.NotAuthorizedException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.Joke;
import com.fours.humorme.model.Rate;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.CommentRepo;
import com.fours.humorme.repository.JokeRepo;
import com.fours.humorme.repository.RateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class JokeService {
    @Autowired private JokeRepo jokeRepo;

    @Autowired private RateRepo rateRepo;

    @Autowired private CommentRepo commentRepo;

    public Joke create(JokeDto jokeDto, User user){
        Joke joke = new Joke(jokeDto.getTitle(), jokeDto.getText(), jokeDto.getLabels());
        joke.setUser(user);
        return jokeRepo.save(joke);
    }

    public Rate rate(Joke joke, User user, String label) throws JsonProcessingException {
        Rate rate = new Rate(joke, user, label);
        rate = rateRepo.save(rate);
        Joke updatedJoke = recalculateRates(joke);
        rate.setJoke(updatedJoke);
        return rate;
    }

    public void delete(Long jokeId, User user) throws NotFoundException, NotAuthorizedException {
        Joke joke = findById(jokeId);
        if(joke.getUser().getId().equals(user.getId())){
            // delete if any comments exists for this joke
            commentRepo.deleteCommentsByJoke(joke);
            // then delete joke
            jokeRepo.delete(joke);
            return;
        }
        throw new NotAuthorizedException("Insufficient privilege to delete the joke.");
    }

    public Joke findById(Long id) throws NotFoundException {
        Optional<Joke> joke = jokeRepo.findById(id);
        if(joke.isPresent()){
            return joke.get();
        }
        throw new NotFoundException("JOke with id " + id + " is not found.");
    }

    public List<Joke> findAll(){
        return jokeRepo.findAll();
    }

    public List<Rate> findJokeRatings(Joke joke){ return rateRepo.findAllByJoke(joke);}

    private String serializeHashMapToJson(HashMap<String, Integer> hashMap) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(hashMap);
    }
    private Joke recalculateRates(Joke joke) throws JsonProcessingException {
        List<Rate> jokeRatings = rateRepo.findAllByJoke(joke);
        HashMap<String, Integer> labelCounts = new HashMap<>();
        jokeRatings.forEach(rate -> {
            String rateLabel = rate.getLabel();
            Integer existingCount = labelCounts.getOrDefault(rateLabel, 0);
            labelCounts.put(rateLabel, existingCount + 1);
        });
        String labelCountsStr = serializeHashMapToJson(labelCounts);
        joke.setRatings(labelCountsStr);
        return jokeRepo.save(joke);
    }

}

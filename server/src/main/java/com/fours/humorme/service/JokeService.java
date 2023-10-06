package com.fours.humorme.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fours.humorme.dto.joke.JokeDto;
import com.fours.humorme.exception.NotAuthorizedException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.Joke;
import com.fours.humorme.model.Rate;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.CommentRepo;
import com.fours.humorme.repository.JokeRepo;
import com.fours.humorme.repository.RateRepo;
import com.fours.humorme.specs.JokeQueryParams;
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

        Optional<Rate> existingUserJokeRating = rateRepo.findAllByUser_Id_AndJoke_Id(user.getId(), joke.getId());
        Rate rate;

        rate = existingUserJokeRating.orElseGet(() -> new Rate(joke, user, label));
        rate.setLabel(label);
        rate = rateRepo.save(rate);
        Joke updatedJoke = recalculateRates(joke);
        rate.setJoke(updatedJoke);
        return rate;

    }

    public void delete(Long jokeId, User user) throws NotFoundException, NotAuthorizedException {
        Joke joke = findById(jokeId);
        if(joke.getUser().getId().equals(user.getId())){
            // delete if any ratings exists for this joke
            rateRepo.deleteRatesByJoke(joke);
            // delete if any comments exists for this joke
            commentRepo.deleteCommentsByJoke(joke);
            // then delete joke
            jokeRepo.delete(joke);
            return;
        }
        throw new NotAuthorizedException("Insufficient privilege to delete the joke.");
    }

    public Joke deleteRating(Joke joke, User user, Long rateId) throws NotFoundException, JsonProcessingException, NotAuthorizedException {
        Rate rate = findJokeRating(rateId);
        if(rate.getUser().getId().equals(user.getId())){
            rateRepo.delete(rate);
            return recalculateRates(joke);
        }
        throw new NotAuthorizedException("Insufficient privilege to delete the rating.");
    }

    public Joke findById(Long id) throws NotFoundException {
        Optional<Joke> joke = jokeRepo.findById(id);
        if(joke.isPresent()){
            return joke.get();
        }
        throw new NotFoundException("Joke with id " + id + " is not found.");
    }

    public List<Joke> findAll(JokeQueryParams params){
        return jokeRepo.findAll(params.searchSpecs());
    }

    public List<Rate> findJokeRatings(Joke joke){ return rateRepo.findAllByJoke(joke);}

    public List<Rate> findMyJokeRatings(User user){
        return rateRepo.findAllByUser_Id(user.getId());
    }

    public Rate findJokeRating(Long id) throws NotFoundException {
        Optional<Rate> rate = rateRepo.findById(id);
        if(rate.isPresent()) return rate.get();
        throw new NotFoundException("Rating with id " + id + " is not found.");
    }

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

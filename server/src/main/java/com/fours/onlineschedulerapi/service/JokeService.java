package com.fours.onlineschedulerapi.service;

import com.fours.onlineschedulerapi.dto.JokeDto;
import com.fours.onlineschedulerapi.exception.NotAuthorizedException;
import com.fours.onlineschedulerapi.exception.NotFoundException;
import com.fours.onlineschedulerapi.model.Joke;
import com.fours.onlineschedulerapi.model.User;
import com.fours.onlineschedulerapi.repository.JokeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JokeService {
    @Autowired private JokeRepo jokeRepo;

    public Joke create(JokeDto jokeDto, User user){
        Joke joke = new Joke(jokeDto.getTitle(), jokeDto.getText(), jokeDto.getLabels());
        joke.setUser(user);
        return jokeRepo.save(joke);
    }

    public void delete(Long jokeId, User user) throws NotFoundException, NotAuthorizedException {
        Joke joke = getById(jokeId);
        if(joke.getUser().getId().equals(user.getId())){
            jokeRepo.delete(joke);
            return;
        }
        throw new NotAuthorizedException("Insufficient priviledge to delete the joke.");
    }

    public Joke getById(Long id) throws NotFoundException {
        Optional<Joke> joke = jokeRepo.findById(id);
        if(joke.isPresent()){
            return joke.get();
        }
        throw new NotFoundException("JOke with id " + id + " is not found.");
    }

    public List<Joke> getAll(){
        return jokeRepo.findAll();
    }
}

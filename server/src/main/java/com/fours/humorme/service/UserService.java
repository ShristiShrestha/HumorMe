package com.fours.humorme.service;

import com.fours.humorme.constants.ResponseMessage;
import com.fours.humorme.dto.user.PostUserDto;
import com.fours.humorme.dto.user.UserDto;
import com.fours.humorme.dto.user.UserFollowDto;
import com.fours.humorme.dto.user.UserMiniDto;
import com.fours.humorme.exception.BadRequestException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired private AuthenticatedUserService authService;

    @Autowired
    public UserService(BCryptPasswordEncoder bCryptPasswordEncoder){
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public User save(PostUserDto request) throws BadRequestException {

        Optional<User> savedUser = userRepository.findByEmail(request.getEmail());

        if (savedUser.isPresent()) {
            throw new BadRequestException("User with provided email already exists.");
        } else {
            User user = new User(request.getName(), request.getEmail(), request.getPassword());
            user.setIsEnabled(true);
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            return userRepository.save(user);

        }
    }

    public User update(User loggedUser, UserMiniDto user) {
        loggedUser.setName(user.getName());
        return userRepository.save(loggedUser);
    }

    public User patchFollowing(User loggedUser, User toFollow, UserFollowDto request){
        // who am I following
        Set<User> loggedUserFollowings = loggedUser.getFollowings();

        // followers of who am I following
        Set<User> toFollowFollowers = toFollow.getFollowers();

        // if asked to follow a user
        if(request.getFollow() != null && request.getFollow()){
            // add one more following
            loggedUserFollowings.add(toFollow);

            // add one more (me) to the list of followers of whom I am following
            toFollowFollowers.add(loggedUser);
        }

        // else asked to unfollow the user
        else{
            // remove the one I am following
            loggedUserFollowings.remove(toFollow);
            // remove me from the followers list
            toFollowFollowers.remove(loggedUser);
        }

        // update loggedUser and toFollowUser information in db table
        loggedUser.setFollowings(loggedUserFollowings);
        toFollow.setFollowers(toFollowFollowers);

        userRepository.save(toFollow);
        return userRepository.save(loggedUser);
    }


    public User findById(Long id) throws BadRequestException {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new BadRequestException(ResponseMessage.NON_EXISTENT_USER));
    }

    public User findByName(String name) throws NotFoundException {
        Optional<User> user = userRepository.findByEmailOrName(name, name);
        if(user.isPresent())
            return user.get();
        throw new NotFoundException("User with name " + name + " is not found.");
    }

    public User getAuthenticatedUser() throws NotFoundException {
        String authenticatedUsername = authService.getUsername();
        Optional<User> user = userRepository.findByEmailOrName(authenticatedUsername, authenticatedUsername);
        if(user.isPresent())
            return user.get();
        throw new NotFoundException("User with name " + authenticatedUsername + " is not found.");
    }
}

package com.fours.humorme.service;

import com.fours.humorme.constants.ResponseMessage;
import com.fours.humorme.dto.PostUserDto;
import com.fours.humorme.dto.UserDto;
import com.fours.humorme.exception.BadRequestException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.UserRepository;
import com.fours.humorme.utils.FilterSortUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired private AuthenticatedUserService authService;

    @Autowired
    public UserService(BCryptPasswordEncoder bCryptPasswordEncoder){
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public UserDto save(PostUserDto request) throws BadRequestException {

        Optional<User> savedUser = userRepository.findByEmail(request.getEmail());

        if (savedUser.isPresent()) {
            throw new BadRequestException("User with provided email already exists.");
        } else {
            User user = new User(request.getName(), request.getEmail(), request.getPassword());
            user.setIsEnabled(true);
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return new UserDto(user);
        }
    }

    public UserDto update(UserDto user) {
        Long id = user.getId();

        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User with provided id doesn't exist.");
        } else {
            User userToUpdate = userOptional.get();

            User updatedUser = userRepository.save(userToUpdate);

            return new UserDto(updatedUser);
        }
    }

    public void delete(long id) {
        userRepository.updateIsEnabled(id, false);
    }

    public List<UserDto> findAll(
            Optional<String> sortBy,
            Optional<String> filterKey,
            Optional<String> filterValue
    ) {
        List<UserDto> userDto = new ArrayList<>();
        List<User> users = (List<User>) userRepository.findAll();

        if (!users.isEmpty()) {
            //Filter by role; either tutor, student or coordinator

            //Convert to dto
            userDto.addAll(
                    users.stream()
                            .map(UserDto::new)
                            .collect(Collectors.toList())
            );

            //Filter based on filter key and value
            if (filterKey.isPresent() && filterValue.isPresent()) {
                String fKey = filterKey.get();
                String fValue = filterValue.get();

                userDto = FilterSortUtil.filterUsers(fKey, fValue, userDto);
            }

            if (sortBy.isPresent())
                FilterSortUtil.sortUsers(sortBy.get(), userDto);
        }

        return userDto;
    }

    public UserDto findById(Long id) throws BadRequestException {
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new BadRequestException(ResponseMessage.NON_EXISTENT_USER));
        return new UserDto(user);
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

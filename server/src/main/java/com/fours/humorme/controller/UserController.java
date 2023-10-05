package com.fours.humorme.controller;

import com.fours.humorme.constants.AuthConstants;
import com.fours.humorme.constants.ResponseMessage;
import com.fours.humorme.constants.RoleConstants;
import com.fours.humorme.dto.user.PostUserDto;
import com.fours.humorme.dto.user.UserDto;
import com.fours.humorme.dto.user.UserFollowDto;
import com.fours.humorme.dto.user.UserMiniDto;
import com.fours.humorme.exception.BadRequestException;
import com.fours.humorme.exception.NotFoundException;
import com.fours.humorme.model.User;
import com.fours.humorme.service.AuthenticatedUserService;
import com.fours.humorme.service.CookieService;
import com.fours.humorme.service.UserService;
import com.fours.humorme.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityExistsException;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping(value = "/signup")
    public ResponseEntity<?> save(@RequestBody PostUserDto user) {
        try {
            User savedUser = userService.save(user);

            String email = savedUser.getEmail();

            final String token = jwtTokenUtil.generateToken(email);

            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE,
                            CookieService.getResponseCookie("Bearer " + token, AuthConstants.JWT_TOKEN_VALIDITY).toString())
                    .build();
        } catch (BadRequestException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/follow")
    public ResponseEntity<UserDto> follow(@PathVariable Long id, @RequestBody UserFollowDto request) throws NotFoundException, BadRequestException {
        User loggedUser = userService.getAuthenticatedUser();
        User toFollow = userService.findById(id);
        loggedUser = userService.patchFollowing(loggedUser, toFollow, request);
        return ResponseEntity.ok(new UserDto(loggedUser));

    }

    @PatchMapping
    public ResponseEntity<UserDto> patchUser(@RequestBody UserMiniDto request) throws EntityExistsException, NotFoundException {
        User loggedUser = userService.getAuthenticatedUser();
        User updatedUser = userService.update(loggedUser, request);
        return ResponseEntity.ok(new UserDto(updatedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable("id") Long id) throws BadRequestException {
        return ResponseEntity.ok(new UserDto(userService.findById(id)));
    }
}

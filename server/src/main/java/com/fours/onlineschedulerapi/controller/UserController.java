package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.auth.JwtUserDetailService;
import com.fours.onlineschedulerapi.constants.AuthConstants;
import com.fours.onlineschedulerapi.constants.ResponseMessage;
import com.fours.onlineschedulerapi.constants.RabbitMqConstant;
import com.fours.onlineschedulerapi.constants.RoleConstants;
import com.fours.onlineschedulerapi.exception.BadRequestException;
import com.fours.onlineschedulerapi.model.User;
import com.fours.onlineschedulerapi.dto.UserDto;
import com.fours.onlineschedulerapi.service.*;
import com.fours.onlineschedulerapi.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityExistsException;
import java.util.Optional;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping(value = "/signup")
    public ResponseEntity<?> save(@RequestBody User user) {
        try {
            UserDto savedUser = userService.save(user);

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

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (authenticatedUserService.getAuthorities().contains(RoleConstants.COORDINATOR)) {
            userService.delete(id);

            return new ResponseEntity<>(
                    ResponseMessage.USER_DELETED,
                    HttpStatus.OK
            );
        } else {

            return new ResponseEntity<>(
                    ResponseMessage.UNAUTHORIZED,
                    HttpStatus.FORBIDDEN
            );
        }
    }

    @PutMapping()
    public ResponseEntity<?> update(@RequestBody UserDto user) throws EntityExistsException {
        UserDto updatedUser = userService.update(user);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping()
    public ResponseEntity<?> getAll(
            @RequestParam("sortBy") Optional<String> sortBy,
            @RequestParam("filterKey") Optional<String> filterKey,
            @RequestParam("filterValue") Optional<String> filterValue,
            @RequestParam("role") Optional<String> role
    ) {
        return ResponseEntity.ok(userService.getAll(sortBy, filterKey, filterValue, role));
    }

    @GetMapping("/{id}/appointment")
    public ResponseEntity<?> getAppointments(
            @RequestParam("status") Optional<String> status,
            @RequestParam("upcoming") Optional<Boolean> upcoming,
            @PathVariable("id") Long id,
            @RequestParam("sortBy") Optional<String> sortBy,
            @RequestParam("year") Optional<String> year,
            @RequestParam("month") Optional<String> month
    ) {

        return ResponseEntity.ok(
                appointmentService.getByTutorId(id, status, upcoming, sortBy, year, month)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) throws BadRequestException {

        return ResponseEntity.ok(userService.getById(id));
    }
}

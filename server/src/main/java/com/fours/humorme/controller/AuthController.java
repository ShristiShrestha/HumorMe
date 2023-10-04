package com.fours.humorme.controller;

import com.fours.humorme.auth.AuthService;
import com.fours.humorme.auth.JwtUserDetailService;
import com.fours.humorme.constants.AuthConstants;
import com.fours.humorme.dto.user.UserDto;
import com.fours.humorme.dto.jwt.JwtRequest;
import com.fours.humorme.model.User;
import com.fours.humorme.service.AuthenticatedUserService;
import com.fours.humorme.service.CookieService;
import com.fours.humorme.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailService userDetailsService;

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @PostMapping(value = "/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest)
            throws Exception {
        String email = authenticationRequest.getEmail();

        authService.authenticate(email, authenticationRequest.getPassword());

        final String token = jwtTokenUtil.generateToken(email);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        CookieService.getResponseCookie("Bearer " + token, AuthConstants.JWT_TOKEN_VALIDITY).toString())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token) // add auth in response header, just in case
                .build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile() {
        final String userName = authenticatedUserService.getUsername();

        final User userDetails = userDetailsService
                .loadUser(userName);

        return new ResponseEntity<>(
                new UserDto(userDetails),
                HttpStatus.OK
        );
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout() {

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        CookieService.getResponseCookie("", 0).toString())
                .build();
    }
}

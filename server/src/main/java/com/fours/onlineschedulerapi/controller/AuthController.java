package com.fours.onlineschedulerapi.controller;

import com.fours.onlineschedulerapi.auth.AuthService;
import com.fours.onlineschedulerapi.auth.JwtUserDetailService;
import com.fours.onlineschedulerapi.model.JwtRequest;
import com.fours.onlineschedulerapi.model.JwtResponse;
import com.fours.onlineschedulerapi.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailService userDetailsService;

    @PostMapping(value = "/access-token")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

        authService.authenticate(authenticationRequest.getEmail(), authenticationRequest.getPassword());

        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authenticationRequest.getEmail());

        final String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping(value = "/check")
    public ResponseEntity<?> checkAuthentication() {

        return ResponseEntity.ok(new JwtResponse("Authentication works!"));
    }
}

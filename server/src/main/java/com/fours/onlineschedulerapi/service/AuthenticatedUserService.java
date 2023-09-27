package com.fours.onlineschedulerapi.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AuthenticatedUserService {

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getUsername() {
        return this.getAuthentication().getName();
    }

    public List<String> getAuthorities() {
        List<String> roles = new ArrayList<>();
        List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>) this.getAuthentication().getAuthorities();

        for (SimpleGrantedAuthority authority: authorities) {
            roles.add(authority.getAuthority());
        }

        return roles;
    }
}

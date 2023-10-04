package com.fours.humorme.dto.jwt;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class JwtResponse implements Serializable {

    private String token;

    private String username;

    private List<String> roles = new ArrayList<>();

    public JwtResponse(String username, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        List<SimpleGrantedAuthority> roles = (List<SimpleGrantedAuthority>) authorities;

        for (SimpleGrantedAuthority role: roles) {
            this.roles.add(role.getAuthority());
        }
    }

    public JwtResponse(String token, String username, Collection<? extends GrantedAuthority> authorities) {
        this.token = token;
        this.username = username;
        List<SimpleGrantedAuthority> roles = (List<SimpleGrantedAuthority>) authorities;

        for (SimpleGrantedAuthority role: roles) {
            this.roles.add(role.getAuthority());
        }
    }
}

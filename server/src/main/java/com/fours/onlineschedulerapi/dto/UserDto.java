package com.fours.onlineschedulerapi.dto;

import com.fours.onlineschedulerapi.model.Role;
import com.fours.onlineschedulerapi.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {

    private Long id;

    private String name;

    private String email;

    private Date createdAt;

    public UserDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.createdAt = user.getCreatedAt();
    }
}

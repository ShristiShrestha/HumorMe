package com.fours.humorme.dto.user;

import com.fours.humorme.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class UserMiniDto {
    private Long id;

    private String name;

    private String email;

    private Date createdAt;

    UserMiniDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
    }
}

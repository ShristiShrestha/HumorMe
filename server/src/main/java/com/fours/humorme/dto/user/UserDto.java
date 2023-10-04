package com.fours.humorme.dto.user;

import com.fours.humorme.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class UserDto extends UserMiniDto {
    private List<UserMiniDto> followers;
    private List<UserMiniDto> followings;

    public UserDto(User user) {
        super(user);
        this.followers = user.getFollowers().stream().map(UserMiniDto::new).collect(Collectors.toList());
        this.followings = user.getFollowings().stream().map(UserMiniDto::new).collect(Collectors.toList());
    }
}





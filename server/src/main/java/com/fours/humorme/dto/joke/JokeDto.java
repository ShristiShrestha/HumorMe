package com.fours.humorme.dto.joke;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JokeDto {
    private String title;
    private String text;
    private String labels;
}


package com.fours.humorme.exception;

import lombok.Setter;

@Setter
public class NotFoundException extends Throwable {
    private String message;

    public NotFoundException(String message) {
        this.message = message;
    }
}

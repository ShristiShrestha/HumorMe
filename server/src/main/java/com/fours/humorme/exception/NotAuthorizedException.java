package com.fours.humorme.exception;

import lombok.Getter;

@Getter
public class NotAuthorizedException extends Exception {
    private String message;

    public NotAuthorizedException(String message) {
        this.message = message;
    }
}

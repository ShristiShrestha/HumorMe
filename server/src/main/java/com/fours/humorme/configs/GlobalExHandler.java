package com.fours.humorme.configs;

import com.fours.humorme.exception.BadRequestException;
import com.fours.humorme.exception.NotAuthorizedException;
import com.fours.humorme.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExHandler {

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleException(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("A server error occurred.\n" + ex.getLocalizedMessage());
//    }

    @ExceptionHandler(NotAuthorizedException.class)
    public ResponseEntity<String> handleNotAuthorized(NotAuthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Insufficient privilege. \n" + ex.getLocalizedMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Entity does not exists. \n" + ex.getLocalizedMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad request from user.\n" + ex.getLocalizedMessage());
    }

//    @ExceptionHandler(HttpClientErrorException.MethodNotAllowed.class)
//    public ResponseEntity<String> handleMethodNotAllowed(HttpClientErrorException.MethodNotAllowed ex) {
//        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ex.getMessage());
//    }
}

package com.fours.humorme.service;

import org.springframework.http.ResponseCookie;

import static com.fours.humorme.constants.AuthConstants.COOKIE_TOKEN_PREFIX;

public class CookieService {

    public static ResponseCookie getResponseCookie(String token, int age) {

        ResponseCookie responseCookie = ResponseCookie.from(COOKIE_TOKEN_PREFIX, token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(age)
                .build();

        return responseCookie;
    }

    public static String getTokenFromCookieString(String cookie) {
        String[] cookieItems = cookie.split(";");
        String token = "";

        for (String item: cookieItems) {
            if (item.startsWith(COOKIE_TOKEN_PREFIX)) {
                token = item.split("=")[1];
                token = token.replace("Bearer ", "");
                System.out.println("Token received: " + token);
            }else{
                System.out.println("Cookie does not start with " + COOKIE_TOKEN_PREFIX);
            }
        }

        return token;
    }
}

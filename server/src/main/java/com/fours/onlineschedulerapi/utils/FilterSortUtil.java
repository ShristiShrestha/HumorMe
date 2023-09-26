package com.fours.onlineschedulerapi.utils;

import com.fours.onlineschedulerapi.dto.UserDto;
import com.fours.onlineschedulerapi.model.Appointment;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class FilterSortUtil {

    public static List<UserDto> filterUsers(String filterKey, String filterValue, List<UserDto> users) {
        switch (filterKey.toLowerCase()) {
            case "name":
                return users.stream()
                        .filter(user -> user.getName().toLowerCase().contains(filterValue.toLowerCase()))
                        .collect(Collectors.toList());
            case "email":
                return users.stream()
                        .filter(user -> user.getEmail().equalsIgnoreCase(filterValue))
                        .collect(Collectors.toList());
            default:
                return users;
        }
    }

    public static void sortUsers(String sortBy, List<UserDto> users) {
        switch (sortBy.toLowerCase()) {
            case "name":
                users.sort(Comparator.comparing(userDto -> userDto.getName().toLowerCase()));
                return;
            case "-name":
                users.sort(Comparator.comparing(userDto -> userDto.getName().toLowerCase(), Comparator.reverseOrder()));
                return;
            default:
        }
    }

    public static void sortAppointments(String sortBy, List<Appointment> appointments) {
        switch (sortBy.toLowerCase()) {
            case "updatedAt":
                appointments.sort(Comparator.comparing(Appointment::getUpdatedAt));
                return;
            case "scheduledAt":
                appointments.sort(Comparator.comparing(Appointment::getScheduledAt));
                return;
            case "-updatedAt":
                appointments.sort(Comparator.comparing(Appointment::getUpdatedAt, Comparator.reverseOrder()));
                return;
            case "-scheduledAt":
                appointments.sort(Comparator.comparing(Appointment::getScheduledAt, Comparator.reverseOrder()));
                return;
            default:
        }
    }
}

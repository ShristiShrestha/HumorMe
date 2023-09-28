package com.fours.humorme.utils;

import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static Integer getYear(Date date) {
        return date.getYear() + 1900;
    }

    public static Integer getMonth(String month) {

        switch (month.toLowerCase()) {
            case "january":
                return Calendar.JANUARY;
            case "february":
                return Calendar.FEBRUARY;
            case "march":
                return Calendar.MARCH;
            case "april":
                return Calendar.APRIL;
            case "may":
                return Calendar.MAY;
            case "june":
                return Calendar.JUNE;
            case "july":
                return Calendar.JULY;
            case "august":
                return Calendar.AUGUST;
            case "september":
                return Calendar.SEPTEMBER;
            case "october":
                return Calendar.OCTOBER;
            case "november":
                return Calendar.NOVEMBER;
            case "december":
                return Calendar.DECEMBER;
            default:
                return Integer.valueOf("");
        }
    }
}

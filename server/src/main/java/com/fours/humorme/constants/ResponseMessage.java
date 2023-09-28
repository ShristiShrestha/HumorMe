package com.fours.humorme.constants;

public class ResponseMessage {

    public static final String UNAUTHORIZED = "You don't have sufficient privilege to complete this request.";
    public static final String SYSTEM_CANCELED_APPOINTMENT = "This appointment was automatically canceled because " +
            "it conflicted with other appointments at the same time slot.";
    public static final String NON_EXISTENT_APPOINTMENT = "Appointment with the provided id doesn't exist.";

    public static final String NON_EXISTENT_USER = "User with the provided id doesn't exist.";
    public static final String APPOINTMENT_DELETED = "Appointment has been deleted successfully.";
    public static final String USER_DELETED = "User has been deleted successfully.";

    public static final String APPOINTMENT_RECEIVED_AT_CLIENT = "Appointment's client received at information saved successfully.";
    public static final String MESSAGES_RECEIVED_AT_CLIENT = "Message's received at information saved successfully.";

    public static final String TUTOR_CONFLICTING_TIMESLOT = "Tutor has an appointment scheduled at this timeslot.";
    public static final String STUDENT_CONFLICTING_TIMESLOT = "Student already has an accepted appointment at this time slot.";

    public static final String TUTOR_STUDENT_PENDING_AT_THIS_TIMESLOT = "Student already has an pending appointment with " +
            "the same instructor at this time slot.";

    public static final String APPOINTMENT_ALREADY_RATED = "This appointment has already been rated.";
    public static final String APPOINTMENT_CANT_BE_RATED = "Can't rate this appointment. Appointment is either not accepted or " +
            "meeting hasn't started yet.";

    public static final String RATING_INVALID_RANGE = "Rating should be in range of 1 to 5.";

    public static final String CHAT_MESSAGE_SENT_TO = "Message has been sent to: ";
}

package com.fours.humorme.service;

import com.fours.humorme.constants.AppointmentConstant;
import com.fours.humorme.constants.ResponseMessage;
import com.fours.humorme.constants.RoleConstants;
import com.fours.humorme.dto.UserDto;
import com.fours.humorme.exception.BadRequestException;
import com.fours.humorme.exception.NotAuthorizedException;
import com.fours.humorme.model.Appointment;
import com.fours.humorme.model.Tutor;
import com.fours.humorme.model.User;
import com.fours.humorme.repository.AppointmentRepository;
import com.fours.humorme.repository.TutorRepository;
import com.fours.humorme.repository.UserRepository;
import com.fours.humorme.utils.DateUtil;
import com.fours.humorme.utils.FilterSortUtil;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private AppointmentRepository appointmentRepository;

    private UserRepository userRepository;

    private AuthenticatedUserService authenticatedUserService;

    private TutorRepository tutorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            AuthenticatedUserService authenticatedUserService,
            TutorRepository tutorRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.authenticatedUserService = authenticatedUserService;
        this.tutorRepository = tutorRepository;
    }

    public Appointment save(Appointment appointment) throws BadRequestException {
        this.validateAppointments(
                appointment.getTutorId(),
                appointment.getStudentId(),
                appointment.getScheduledAt()
        );

        appointmentRepository.save(appointment);

        return appointment;
    }

    private void validateAppointments(
            Long tutorId,
            Long studentId,
            Date scheduledAt
    ) throws BadRequestException {

        List<Appointment> conflictingTutorAppointment = appointmentRepository.findByTutorIdAndScheduledAtAndStatus(
                tutorId, scheduledAt, AppointmentConstant.ACCEPTED
        );

        if (!conflictingTutorAppointment.isEmpty())
            throw new BadRequestException(ResponseMessage.TUTOR_CONFLICTING_TIMESLOT);

        List<Appointment> conflictingStudentAppointment = appointmentRepository.findByStudentIdAndScheduledAtAndStatus(
                studentId, scheduledAt, AppointmentConstant.ACCEPTED
        );

        if (!conflictingStudentAppointment.isEmpty())
            throw new BadRequestException(ResponseMessage.STUDENT_CONFLICTING_TIMESLOT);

        Boolean doesPendingAppointmentExist = !appointmentRepository
                .findByTutorIdAndStudentIdAndScheduledAtAndStatus(tutorId, studentId, scheduledAt, AppointmentConstant.PENDING)
                .isEmpty();

        if (doesPendingAppointmentExist)
            throw new BadRequestException(ResponseMessage.TUTOR_STUDENT_PENDING_AT_THIS_TIMESLOT);
    }

    public List<Appointment> getAll(
            Optional<Long> tutorId,
            Optional<Long> studentId,
            Optional<String> month,
            Optional<String> year,
            Optional<Boolean> upcoming
    ) {

        //Get all appointments from database
        List<Appointment> appointments = appointmentRepository.findAllByOrderByScheduledAtAsc();

        //Filter based on present query parameters to narrow the results
        //Improvement: Use criteria builder to query database and fetch filtered results
        if (upcoming.isPresent() && upcoming.get()) {
            Date now = Date.from(Instant.now());

            appointments = appointments.stream()
                    .filter(appointment -> appointment.getScheduledAt().after(now))
                    .collect(Collectors.toList());
        }

        if (tutorId.isPresent()) {
            Long id = tutorId.get();

            appointments = appointments.stream()
                    .filter(appointment -> appointment.getTutorId().equals(id))
                    .collect(Collectors.toList());
        }

        if (studentId.isPresent()) {
            Long id = studentId.get();

            appointments = appointments.stream()
                    .filter(appointment -> appointment.getStudentId().equals(id))
                    .collect(Collectors.toList());
        }

        if (year.isPresent()) {
            Integer y = Integer.valueOf(year.get());

            appointments = appointments.stream()
                    .filter(appointment -> DateUtil.getYear(appointment.getScheduledAt()).equals(y))
                    .collect(Collectors.toList());

            if (month.isPresent() && !month.get().isEmpty()) {
                Integer m = DateUtil.getMonth(
                       month.get()
                );

                appointments = appointments.stream()
                        .filter(appointment -> {
                            Integer mon = appointment.getScheduledAt().getMonth();

                            return mon.equals(m);
                        })
                        .collect(Collectors.toList());
            }
        }

        //Collect student/tutor ids and fetch user details from database
        Set<Long> userIds = appointments.stream()
                .map(Appointment::getTutorId)
                .collect(Collectors.toSet());

        userIds.addAll(
                appointments.stream()
                        .map(Appointment::getStudentId)
                        .collect(Collectors.toList())
        );

        //Set student/tutor details to appointments
        if (!userIds.isEmpty()) {
            List<User> users = userRepository.findByIdIn(userIds);

            appointments.forEach(appointment -> {
                appointment.setStudent(
                        new UserDto(
                                users.stream()
                                        .filter(user -> user.getId().equals(appointment.getStudentId()))
                                        .collect(Collectors.toList())
                                        .get(0)
                        )
                );

                appointment.setTutor(
                        new UserDto(
                                users.stream()
                                        .filter(user -> user.getId().equals(appointment.getTutorId()))
                                        .collect(Collectors.toList())
                                        .get(0)
                        )
                );
            });
        }

        return appointments;
    }

    public Appointment getById(Long id) throws EntityNotFoundException {
        //Get appointment by id from database or throw exception if it doesn't exist
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ResponseMessage.NON_EXISTENT_APPOINTMENT));

        //Set student/tutor details to the appointment
        appointment.setTutor(
                new UserDto(
                        userRepository.findById(appointment.getTutorId()).get()
                )
        );

        appointment.setStudent(
                new UserDto(
                        userRepository.findById(appointment.getStudentId()).get()
                )
        );

        return appointment;
    }

    public List<Appointment> getByTutorId(
            Long tutorId,
            Optional<String> status,
            Optional<Boolean> upcoming,
            Optional<String> sortBy,
            Optional<String> year,
            Optional<String> month
            ) {
        List<Appointment> appointments = appointmentRepository.findByTutorId(tutorId);

        if (status.isPresent() && !status.get().isEmpty()) {
            appointments = appointments.stream()
                    .filter(appointment -> appointment.getStatus().equalsIgnoreCase(status.get()))
                    .collect(Collectors.toList());
        }

        if (upcoming.isPresent() && upcoming.get()) {
            Date now = Date.from(Instant.now());

            appointments = appointments.stream()
                    .filter(appointment -> appointment.getScheduledAt().after(now))
                    .collect(Collectors.toList());
        }

        if (year.isPresent()) {
            Integer y = Integer.valueOf(year.get());

            appointments = appointments.stream()
                    .filter(appointment -> DateUtil.getYear(appointment.getScheduledAt()).equals(y))
                    .collect(Collectors.toList());

            if (month.isPresent() && !month.get().isEmpty()) {
                Integer m = DateUtil.getMonth(
                        month.get()
                );

                appointments = appointments.stream()
                        .filter(appointment -> {
                            Integer mon = appointment.getScheduledAt().getMonth();

                            return mon.equals(m);
                        })
                        .collect(Collectors.toList());
            }
        }

        //Collect student ids and fetch user details from database
        Set<Long> studentIds = appointments.stream()
                .map(Appointment::getStudentId)
                .collect(Collectors.toSet());

        //Set student details to appointments
        if (!studentIds.isEmpty()) {
            List<User> users = userRepository.findByIdIn(studentIds);

            appointments.forEach(appointment -> {
                appointment.setStudent(
                        new UserDto(
                                users.stream()
                                        .filter(user -> user.getId().equals(appointment.getStudentId()))
                                        .collect(Collectors.toList())
                                        .get(0)
                        )
                );
            });
        }

        if (sortBy.isPresent() && !sortBy.get().isEmpty()) {
            String sortVal = sortBy.get();

            FilterSortUtil.sortAppointments(sortVal, appointments);
        }

        return appointments;
    }

    @Transactional
    public Appointment update(Appointment appointment) throws BadRequestException, NotAuthorizedException {
        Long appointmentId = appointment.getId();

        //Get appointment to update from database
        Appointment appointmentToUpdate = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new BadRequestException(ResponseMessage.NON_EXISTENT_APPOINTMENT));

        //Get updated status and status message from the request
        String status = appointment.getStatus();
        String statusMessage = appointment.getStatusMessage();

        //Get updated time slot from the request
        Date scheduledAt = appointment.getScheduledAt();

        //When tutor updates the status of the appointment.
        if (Objects.nonNull(status) && !status.isEmpty() && !status.equalsIgnoreCase(AppointmentConstant.PENDING)) {

            //Check if the status message has been provided in case of rejected appointment.
            if (status.equalsIgnoreCase(AppointmentConstant.REJECTED)
                    && (Objects.isNull(statusMessage) || statusMessage.isEmpty())) {
                throw new BadRequestException("Please provide a rejection message.");
            }

            appointmentToUpdate.setStatus(status.toUpperCase());
            appointmentToUpdate.setStatusMessage(statusMessage);

            appointmentRepository.save(appointmentToUpdate);

            //Reject all the pending appointments at the accepted timeslot for both tutor and student.
            this.rejectPendingAppointmentsAtCurrentlyAcceptedTimeSlot(appointmentToUpdate);

        } //When co-ordinator re-schedules the appointment
        else if (Objects.nonNull(scheduledAt)) {

            if (!authenticatedUserService.getAuthorities().contains(RoleConstants.COORDINATOR))
                throw new NotAuthorizedException(ResponseMessage.UNAUTHORIZED);

            this.validateAppointments(
                    appointmentToUpdate.getTutorId(),
                    appointmentToUpdate.getStudentId(),
                    scheduledAt
            );

            appointmentToUpdate.setScheduledAt(scheduledAt);
            appointmentToUpdate.setStatus(AppointmentConstant.PENDING);
            appointmentToUpdate.setStatusMessage(null);
            appointmentToUpdate.setClientReceivedAt(null);

            appointmentRepository.save(appointmentToUpdate);

        }

        return getById(appointmentToUpdate.getId());
    }

    private void rejectPendingAppointmentsAtCurrentlyAcceptedTimeSlot(Appointment appointment) {
        if (appointment.getStatus().equalsIgnoreCase(AppointmentConstant.ACCEPTED)) {
            Long appointmentId = appointment.getId();
            Long tutorId = appointment.getTutorId();
            Long studentId = appointment.getStudentId();

            Date scheduledAt = appointment.getScheduledAt();

            List<Appointment> tutorAppointmentsToReject = appointmentRepository
                    .findByTutorIdAndScheduledAtAndStatus(tutorId, scheduledAt, AppointmentConstant.PENDING)
                    .stream()
                    .filter(ap -> !ap.getId().equals(appointmentId))
                    .collect(Collectors.toList());

            List<Appointment> studentAppointmentsToReject = appointmentRepository
                    .findByStudentIdAndScheduledAtAndStatus(studentId, scheduledAt, AppointmentConstant.PENDING)
                    .stream()
                    .filter(ap -> !ap.getId().equals(appointmentId))
                    .collect(Collectors.toList());

            tutorAppointmentsToReject.forEach(ap -> {
                ap.setStatus(AppointmentConstant.REJECTED);
                ap.setStatusMessage(ResponseMessage.SYSTEM_CANCELED_APPOINTMENT);
            });

            studentAppointmentsToReject.forEach(ap -> {
                ap.setStatus(AppointmentConstant.REJECTED);
                ap.setStatusMessage(ResponseMessage.SYSTEM_CANCELED_APPOINTMENT);
            });

            if (!tutorAppointmentsToReject.isEmpty())
                appointmentRepository.saveAll(tutorAppointmentsToReject);

            if (!studentAppointmentsToReject.isEmpty())
                appointmentRepository.saveAll(studentAppointmentsToReject);
        }
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> updateClientReceivedAt(List<Long> ids) {
        List<Appointment> appointments = (List) appointmentRepository.findAllById(ids);
        Date receivedAt = Date.from(Instant.now());

        appointments.forEach(appointment -> appointment.setClientReceivedAt(receivedAt));

        appointmentRepository.saveAll(appointments);

        return appointments;
    }

    @Transactional
    public Appointment rate(Long id, Float rating) throws EntityNotFoundException, BadRequestException {
        //Get appointment by id from database or throw exception if it doesn't exist
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ResponseMessage.NON_EXISTENT_APPOINTMENT));

        String status = appointment.getStatus();
        Date scheduledAt = appointment.getScheduledAt();
        Float currentRating = appointment.getRating();

        //Check if the appointment has already been rated.
        if (!currentRating.equals(0.0F))
            throw new BadRequestException(ResponseMessage.APPOINTMENT_ALREADY_RATED);

        //Validate if the appointment can be rated.
        Date currentDate = Date.from(Instant.now());

        if (!status.equals(AppointmentConstant.ACCEPTED) || scheduledAt.after(currentDate))
            throw new BadRequestException(ResponseMessage.APPOINTMENT_CANT_BE_RATED);

        //Valid the rating value
        if (rating < 1.0F || rating > 5.0F)
            throw new BadRequestException(ResponseMessage.RATING_INVALID_RANGE);

        Long tutorId = appointment.getTutorId();

        //Get the list of all rated appointments to calculate the average rating
        List<Appointment> currentTutorsAcceptedAppointmentWithValidRating = this.getByTutorId(
                tutorId,
                Optional.of(AppointmentConstant.ACCEPTED),
                Optional.empty(),
                        Optional.empty(),
                        Optional.empty(),
                        Optional.empty())
                .stream().filter(ap -> ap.getRating() > 0.0F)
                .collect(Collectors.toList());

        //Get the count of rated appointments
        Long ratedAppointmentCount = (long) currentTutorsAcceptedAppointmentWithValidRating.size();

        //Get the rating sum including current rating
        Float ratingSum = currentTutorsAcceptedAppointmentWithValidRating.stream()
                .reduce(0.0F , (sum, ap) -> ap.getRating() + sum, Float::sum) + rating;

        //Calculate the new average rating
        Float calculatedAvgRating = ratingSum / (ratedAppointmentCount + 1);

        //Update tutor rating
        Tutor tutor = tutorRepository.findById(tutorId).get();
        tutor.setRating(calculatedAvgRating);
        tutor.setRatedBy(tutor.getRatedBy() + 1);
        tutorRepository.save(tutor);

        //Update appointment
        appointment.setRating(rating);
        appointmentRepository.save(appointment);

        return getById(appointment.getId());
    }
}

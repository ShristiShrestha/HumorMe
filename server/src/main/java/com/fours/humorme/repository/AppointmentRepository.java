package com.fours.humorme.repository;

import com.fours.humorme.model.Appointment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, Long> {

    List<Appointment> findByTutorIdAndScheduledAtAndStatus(Long tutorId, Date scheduledAt, String status);

    List<Appointment> findByStudentIdAndScheduledAtAndStatus(Long studentId, Date scheduledAt, String status);

    List<Appointment> findAllByOrderByScheduledAtAsc();

    List<Appointment> findByTutorId(Long tutorId);
    List<Appointment> findByTutorIdAndStatus(Long tutorId, String status);

    List<Appointment> findByTutorIdAndStudentIdAndScheduledAtAndStatus(
            Long tutorId, Long studentId, Date scheduledAt, String status
    );
}

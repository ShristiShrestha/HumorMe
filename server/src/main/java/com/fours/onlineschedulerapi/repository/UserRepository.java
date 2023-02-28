package com.fours.onlineschedulerapi.repository;

import com.fours.onlineschedulerapi.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    @Transactional
    @Modifying
    @Query("update User u set u.isEnabled = ?2 where u.id = ?1")
    public void updateIsEnabled(long id, Boolean isEnabled);

    public Optional<User> findByEmail(String email);

    public List<User> findByIdIn(Set<Long> ids);
}

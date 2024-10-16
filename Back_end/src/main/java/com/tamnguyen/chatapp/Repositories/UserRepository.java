package com.tamnguyen.chatapp.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tamnguyen.chatapp.Entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1%")
    List<User> findUsersByName(String name); 
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findUserByEmail(String email); 
}

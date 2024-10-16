package com.tamnguyen.chatapp.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tamnguyen.chatapp.Entities.Message;
@Repository
public interface MessageRepository extends JpaRepository<Message, Long>{

}

package com.tamnguyen.chatapp.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tamnguyen.chatapp.Entities.Conversation;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long>{

}

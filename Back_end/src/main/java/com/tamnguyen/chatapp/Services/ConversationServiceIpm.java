package com.tamnguyen.chatapp.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tamnguyen.chatapp.Entities.Conversation;
import com.tamnguyen.chatapp.Repositories.ConversationRepository;

@Service
public class ConversationServiceIpm implements ConversationService{

    @Autowired
    ConversationRepository conversationRepo;

    @Override
    public Conversation getConversation(Long id) {
        Optional<Conversation> optionalConversation = conversationRepo.findById(id);
        return optionalConversation.orElse(null); // nếu k tìm thấy trả về null
    }

    // @Override
    // public Long createConversation(Conversation conversation) {
    //     Long conversationId = conversationRepo.save(conversation).getId();
    //     return conversationId;
    // }

    @Override
    public Conversation createConversation(Conversation conversation) {
        return conversationRepo.save(conversation);
    }


    @Override
    public void deleteConversation(Long id) {
        conversationRepo.deleteById(id);
    }

    @Override
    public void updateConversation(Long id, Conversation conversation) {
        conversation.setId(id);
        conversationRepo.save(conversation);
    }

}

package com.tamnguyen.chatapp.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tamnguyen.chatapp.Entities.Message;
import com.tamnguyen.chatapp.Repositories.MessageRepository;

@Service
public class MessageServiceIpm implements MessageService{

    @Autowired
    MessageRepository messageRepo;

    @Override
    public Long createMessage(Message message) {
        // Thực hiện lưu tin nhắn vào cơ sở dữ liệu và trả về ID của tin nhắn
        Long messageId = messageRepo.save(message).getId();
        return messageId;
    }
    

    @Override
    public Message getMessageByID(Long id) {
        Optional<Message> optionalMessage = messageRepo.findById(id);
        return optionalMessage.orElse(null); // nếu k tìm thấy trả về null
    }

    // @Override
    // public List<Message> getConversationBetween(Long senderId, Long receiverId) {
    //     return messageRepo.getConversationBetween(senderId, receiverId);
    // }
}

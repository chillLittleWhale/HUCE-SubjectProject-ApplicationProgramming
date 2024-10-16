package com.tamnguyen.chatapp.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tamnguyen.chatapp.Entities.Conversation;
import com.tamnguyen.chatapp.Entities.Message;
import com.tamnguyen.chatapp.Entities.User;
import com.tamnguyen.chatapp.Services.ConversationService;
import com.tamnguyen.chatapp.Services.MessageService;
import com.tamnguyen.chatapp.Services.UserService;

@RestController
@RequestMapping("/conversation")
@CrossOrigin("*")
public class ConversationController {
    @Autowired
    ConversationService converService;
    @Autowired
    UserService userService;
    @Autowired
    MessageService messageService;

    @CrossOrigin("*")
    // @PostMapping()
    // public ResponseEntity<String> addConversation(@RequestBody Conversation conversation) {
    //     Long converId =  converService.createConversation(conversation);
    //     return new ResponseEntity<>(String.valueOf(converId), HttpStatus.CREATED);
    // }
    @PostMapping()
    public ResponseEntity<Conversation> addConversation(@RequestBody Conversation conversation) {
        Conversation createdConversation  =  converService.createConversation(conversation);
        return ResponseEntity.ok(createdConversation);
    }

    @CrossOrigin("*")
    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable Long id) {
        return converService.getConversation(id);
    }
    
    @CrossOrigin("*")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateConversation(@PathVariable Long id, @RequestBody Conversation input) {
        converService.updateConversation(id, input);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @CrossOrigin("*")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConversation(@PathVariable Long id) {
        converService.deleteConversation(id);
        return new ResponseEntity<>(null, HttpStatus.valueOf(204));
    }

    @CrossOrigin("*")
    @GetMapping("/getParticipantList/{conversationId}")
    public ResponseEntity<List<User>> getParticipantList(@PathVariable Long conversationId) {
        Conversation conversation = converService.getConversation(conversationId);

        if (converService == null) {
            System.err.println("lỗi: conversation không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<User> participantList = new ArrayList<User>();
        List<Long> participantIdList = conversation.getParticipantList();
        for (Long id : participantIdList) {
            User newUser = userService.getUserByID(id);
            if (newUser != null) {
                participantList.add(newUser);
            }
        }
        return new ResponseEntity<List<User>>(participantList, HttpStatus.OK);
    }

    @CrossOrigin("*")
    @GetMapping("/getMessageList/{conversationId}")
    public ResponseEntity<List<Message>> getMessageList(@PathVariable Long conversationId) {

        Conversation conversation = converService.getConversation(conversationId);
        if (converService == null) {
            System.err.println("lỗi: conversation không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Message> messageList = new ArrayList<Message>();
        List<Long> messageIdList = conversation.getMessageList();
        for (Long id : messageIdList) {
            Message newMessage = messageService.getMessageByID(id);
            if (newMessage != null) {
                messageList.add(newMessage);
            }
        }
        return new ResponseEntity<List<Message>>(messageList, HttpStatus.OK);
    }
}

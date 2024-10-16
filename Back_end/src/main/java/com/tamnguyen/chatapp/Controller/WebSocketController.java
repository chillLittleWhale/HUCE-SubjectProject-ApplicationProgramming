package com.tamnguyen.chatapp.Controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.tamnguyen.chatapp.Entities.Conversation;
import com.tamnguyen.chatapp.Entities.Message;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public Message chat(@DestinationVariable String roomId, Message message) {
        System.out.println(message);
        return message;
    }

    @MessageMapping("/online")
    public void userOnline(Long userId) {
        onlineUsers.add(userId);
        broadcastUserStatus();
    }

    @MessageMapping("/offline")
    public void userOffline(Long userId) {
        onlineUsers.remove(userId);
        broadcastUserStatus();
    }

    private void broadcastUserStatus() {
        messagingTemplate.convertAndSend("/topic/user-status", onlineUsers);
    }

    @MessageMapping("/request-online-users")
    @SendTo("/topic/user-status")
    public Set<Long> handleRequestOnlineUsers() {
        return onlineUsers;
    }

    @MessageMapping("/new-conversation")
    public void notifyNewConversation(Conversation newConversation) {
        messagingTemplate.convertAndSend("/topic/new-conversation", newConversation);
    }
}

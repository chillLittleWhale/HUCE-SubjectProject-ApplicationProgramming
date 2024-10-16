package com.tamnguyen.chatapp.Entities;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "messages")
public class Message {
    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "senderId")
    private Long senderId;

    private String senderAvatar;     //----v3

    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    private LocalDateTime timeStamp;

    @PrePersist
    public void prePersist() {
        setTimeStamp();
    }

    public void setTimeStamp() {
        this.timeStamp = LocalDateTime.now();
    }
    
}

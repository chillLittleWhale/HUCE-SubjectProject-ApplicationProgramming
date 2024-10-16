package com.tamnguyen.chatapp.Entities;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "conversations")
public class Conversation {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupName;

    private String groupAvatar;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "conversation_participants", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "participant_id_list")
    private List<Long> participantList = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "conversation_messages", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "message_id_list")
    private List<Long> messageList = new ArrayList<>();
}

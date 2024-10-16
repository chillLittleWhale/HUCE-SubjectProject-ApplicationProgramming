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
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "name", columnDefinition = "NVARCHAR(50)")
    private String name;

    @Enumerated(EnumType.STRING)
    private Sex sex;
    
    private String email;

    private String password;

    private List<Long> folowingList= new ArrayList<>();

    private List<Long> folowedList= new ArrayList<>();

    private List<Long> conversationList= new ArrayList<>();

    @Column(name = "avatar", columnDefinition = "VARCHAR(255)")
    private String avatar;

}

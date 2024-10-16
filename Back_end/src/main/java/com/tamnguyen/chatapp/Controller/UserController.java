package com.tamnguyen.chatapp.Controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.tamnguyen.chatapp.Entities.Conversation;
import com.tamnguyen.chatapp.Entities.User;
import com.tamnguyen.chatapp.Services.ConversationService;
import com.tamnguyen.chatapp.Services.UserService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController{
    @Autowired
    UserService userService;

    @Autowired
    ConversationService conversationService;

    @PostMapping()
    public ResponseEntity<?> addUser(@RequestBody User user) {
        userService.createUser(user);
        return new ResponseEntity<>(null, HttpStatus.valueOf(201));
    }

    @GetMapping("/all")
    public Collection<User> getUserList() {
        Collection<User> UserCollection= userService.getAllUsers();
        return UserCollection;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserByID(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    } 

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User input) {
        userService.updateUser(id, input);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}") 
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return new ResponseEntity<>(null, HttpStatus.valueOf(204));
    }

    @GetMapping("/searchbyname")
    public ResponseEntity<List<User>> getUsersByName(@RequestParam String name) {
        List<User> userList = userService.getUserByName(name);
        if (userList != null) {
            return new ResponseEntity<List<User>>(userList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    } 

    @GetMapping("/login")
    public ResponseEntity<Long> logIn(@RequestParam String email, @RequestParam String password) {
        User user = userService.getOneUserByEmail(email);
        if (user != null) {
            if (user.getPassword().equals(password)) {
                return new ResponseEntity<Long>(user.getId(), HttpStatus.OK);        //Login successfully
            } 
            else {return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}      //Password is incorrect
        } 
        else {return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);}         //User not found 
    } 

    @GetMapping("/searchByEmail")
    public ResponseEntity<User> findUserByEmail(@RequestParam String email) {
        User user = userService.getOneUserByEmail(email);
        if(user != null) {
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }   

    @GetMapping("/getFriendList/{userId}")
    public ResponseEntity<List<User>> getFriendList(@PathVariable Long userId) {
        User user = userService.getUserByID(userId);

        if (user == null) {
            System.err.println("lỗi: user không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 
        List<User> friendList = new ArrayList<User>();
        List<Long> folowingList = user.getFolowingList();
        List<Long> folowedList = user.getFolowedList();

        for (Long id : folowedList) {
            if ( folowingList.contains(id)){
                User friend = userService.getUserByID(id);
                if (friend != null){
                    friendList.add(friend);
                }
            }
        }
        return new ResponseEntity<List<User>>(friendList,HttpStatus.OK);
    } 

    @GetMapping("/getFollowingList/{userId}")
    public ResponseEntity<List<User>> getFollowingList(@PathVariable Long userId) {
        User user = userService.getUserByID(userId);

        if (user == null) {
            System.err.println("lỗi: user không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 
        List<User> folowingList = new ArrayList<User>();
        List<Long> folowingIdList = user.getFolowingList();
        for (Long id : folowingIdList) {
            User newUser = userService.getUserByID(id);
            if (newUser != null){
                folowingList.add(newUser);
            }
        }
        return new ResponseEntity<List<User>>(folowingList,HttpStatus.OK);
    } 

    @GetMapping("/getFollowedList/{userId}")
    public ResponseEntity<List<User>> getFollowedList(@PathVariable Long userId) {
        User user = userService.getUserByID(userId);

        if (user == null) {
            System.err.println("lỗi: user không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 
        List<User> folowedList = new ArrayList<User>();
        List<Long> folowedIdList = user.getFolowedList();
        for (Long id : folowedIdList) {
            User newUser = userService.getUserByID(id);
            if (newUser != null){
                folowedList.add(newUser);
            }
        }
        return new ResponseEntity<List<User>>(folowedList,HttpStatus.OK);
    } 

    @GetMapping("/getConversationList/{userId}")
    public ResponseEntity<List<Conversation>> getConversationList(@PathVariable Long userId) {
        User user = userService.getUserByID(userId);

        if (user == null) {
            System.err.println("lỗi: user không tồn tại");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } 
        List<Conversation> conversationList = new ArrayList<Conversation>();
        List<Long> ConversationIdList = user.getConversationList();
        for (Long id : ConversationIdList) {
            Conversation newConversation = conversationService.getConversation(id);
            if (newConversation != null){
                conversationList.add(newConversation);
            }
        }
        return new ResponseEntity<List<Conversation>>(conversationList,HttpStatus.OK);
    } 
}

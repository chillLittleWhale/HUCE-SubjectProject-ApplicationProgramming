package com.tamnguyen.chatapp.Services;

import java.util.Collection;
import java.util.List;

import com.tamnguyen.chatapp.Entities.User;

public interface UserService {
    public abstract User getUserByID(Long id);
    public abstract void createUser(User user);
    public abstract void updateUser(Long id, User user);
    public abstract void deleteUser(Long id);
    public abstract Collection<User> getAllUsers();

    public abstract List<User> getUserByName(String name);
    public abstract User getOneUserByEmail(String email);

}

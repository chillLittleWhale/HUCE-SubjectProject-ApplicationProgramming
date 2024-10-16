package com.tamnguyen.chatapp.Services;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tamnguyen.chatapp.Entities.User;
import com.tamnguyen.chatapp.Repositories.UserRepository;

@Service
public class UserServiceIpm implements UserService{
    @Autowired
    UserRepository userRepo;
    
    @Override
    public User getUserByID(Long id) {
        Optional<User> optionalUser = userRepo.findById(id);
        return optionalUser.orElse(null); // nếu k tìm thấy trả về null
    }

    @Override
    public void createUser(User user) {
        userRepo.save(user);
    }

    @Override
    public void updateUser(Long id, User user) {
        user.setId(id);
        userRepo.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    @Override
    public Collection<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public List<User> getUserByName(String name) {
        return userRepo.findUsersByName(name);
    }

    @Override
    public User getOneUserByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }

}

package com.prasad.ecomBackend.service;

import com.prasad.ecomBackend.model.Users;
import com.prasad.ecomBackend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepo repo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JwtService service;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    public void addUser(Users user){
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
    }

    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()){
            return service.generateToken(user.getUsername());
        }
        return "failure";
    }
}

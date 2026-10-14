package com.prasad.ecomBackend.controller;

import com.prasad.ecomBackend.model.Users;
import com.prasad.ecomBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("user")
public class UsersController {
    @Autowired
    UserService service;

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody Users user) {
        service.addUser(user);
        return ResponseEntity.ok("User registered: " + user.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Users user) throws AuthenticationException {
        return ResponseEntity.ok(service.verify(user));
    }
}

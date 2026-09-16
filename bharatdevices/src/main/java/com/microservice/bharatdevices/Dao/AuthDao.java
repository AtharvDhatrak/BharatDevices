package com.microservice.bharatdevices.Dao;

import java.util.Optional;

import com.microservice.bharatdevices.Model.User;

public interface AuthDao {
    Optional<User> findByIdentifier(String identifier);
    Optional<User> findByUsername(String username);
    User saveUser(User user);
    void saveOtp(String identifier, String otp);
    Optional<String> getOtpByIdentifier(String identifier);
    void deleteOtp(String identifier);
}

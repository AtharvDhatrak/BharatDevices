package com.microservice.bharatdevices.Services;

import com.microservice.bharatdevices.Model.AuthRequestDTO;
import com.microservice.bharatdevices.Model.AuthResponseDTO;
import com.microservice.bharatdevices.Model.User;

public interface AuthService {
    AuthResponseDTO loginUser(AuthRequestDTO request);
    AuthResponseDTO loginAdmin(AuthRequestDTO request);
    User createAdminUser(User newAdminUser);
}
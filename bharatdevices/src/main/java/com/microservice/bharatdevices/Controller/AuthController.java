package com.microservice.bharatdevices.Controller;

import com.microservice.bharatdevices.Model.AuthRequestDTO;
import com.microservice.bharatdevices.Model.AuthResponseDTO;
import com.microservice.bharatdevices.Model.User;
import com.microservice.bharatdevices.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // Updated to include /v1
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponseDTO> adminLogin(@RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/register")
    public ResponseEntity<User> registerAdmin(@RequestBody User newAdmin) {
        User createdAdmin = authService.createAdminUser(newAdmin);
        return ResponseEntity.ok(createdAdmin);
    }
}
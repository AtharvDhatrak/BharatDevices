package com.microservice.bharatdevices.Services.ServiceImpl;

import com.microservice.bharatdevices.Dao.AuthDao;
import com.microservice.bharatdevices.Model.AuthRequestDTO;
import com.microservice.bharatdevices.Model.AuthResponseDTO;
import com.microservice.bharatdevices.Model.User;
import com.microservice.bharatdevices.Services.AuthService;
import com.microservice.bharatdevices.Utils.JwtUtil;
import com.microservice.bharatdevices.Utils.PasswordUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthDao authDao;

    @Autowired
    private JwtUtil jwtUtil;
    @Override
public AuthResponseDTO loginUser(AuthRequestDTO request) {
    User user = authDao.findByIdentifier(request.getIdentifier())
            .orElseThrow(() -> new RuntimeException("User not found with provided identifier."));

    String hashedInputPassword = PasswordUtil.hashPasswordSHA512(request.getPassword());
    if (user.getPassword() == null || !user.getPassword().equalsIgnoreCase(hashedInputPassword)) {
        throw new RuntimeException("Invalid credentials.");
    }

    if (request.getPortal() != null && user.getRole() != null && !user.getRole().equalsIgnoreCase(request.getPortal())) {
        throw new RuntimeException("Access denied: Authorization portal mismatch.");
    }

    // FIX: Generate a real, signed JWT token with user authority claims
    String jwtToken = jwtUtil.generateToken(user.getIdentifier(), user.getRole());
    
    return new AuthResponseDTO(jwtToken, "Login successful", user.getRole());
}

    @Override
public AuthResponseDTO loginAdmin(AuthRequestDTO request) {
    // 1. Fetch User Profile
    User user = authDao.findByIdentifier(request.getIdentifier())
            .orElseThrow(() -> new RuntimeException("Admin account not found with provided identifier."));

    // 2. Password Verification via SHA-512 Hash
    String hashedInputPassword = PasswordUtil.hashPasswordSHA512(request.getPassword());
    if (user.getPassword() == null || !user.getPassword().equalsIgnoreCase(hashedInputPassword)) {
        throw new RuntimeException("Invalid credentials.");
    }

    // 3. Check for ADMIN or SUPERADMIN privileges
    String role = user.getRole() != null ? user.getRole().toUpperCase() : "";
    if (!"ADMIN".equals(role) && !"SUPERADMIN".equals(role)) {
        throw new RuntimeException("Access denied: Insufficient administration privileges.");
    }

    // 4. Generate real, cryptographically signed JWT token
    String jwtToken = jwtUtil.generateToken(user.getIdentifier(), role);

    return new AuthResponseDTO(jwtToken, "Admin Authorization Granted", user.getRole());
}

    @Override
    public User createAdminUser(User newAdminUser) {
        // Enforce the ADMIN portal/role for created users
        newAdminUser.setRole("ADMIN");
        if (newAdminUser.getProvider() == null) {
            newAdminUser.setProvider("LOCAL");
        }
        
        // Hash raw password with SHA-512 before persisting to database
        if (newAdminUser.getPassword() != null) {
            String hashedPassword = PasswordUtil.hashPasswordSHA512(newAdminUser.getPassword());
            newAdminUser.setPassword(hashedPassword);
        }

        return authDao.saveUser(newAdminUser);
    }
}
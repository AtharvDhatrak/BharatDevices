package com.microservice.bharatdevices.Model;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private UUID id;
    private String fullName;
    private String email;
    private String username;
    private String role; // portal
    private String provider; // auth_provider
    private String password; // used for DTO payload handling

    public String getIdentifier() {
        return this.email != null ? this.email : this.username;
    }
}
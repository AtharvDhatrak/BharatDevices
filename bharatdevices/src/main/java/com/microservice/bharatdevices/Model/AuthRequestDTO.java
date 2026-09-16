package com.microservice.bharatdevices.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDTO {
    private String identifier;
    private String password;
    private String portal;
    private String adminKey;
}
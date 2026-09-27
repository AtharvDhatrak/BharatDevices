package com.microservice.bharatdevices.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "brands")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();
}

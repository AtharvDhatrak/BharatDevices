package com.microservice.bharatdevices.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @Column(name = "enquiry_id", nullable = false, unique = true)
    private String enquiryId;

    private String name;
    private String company;
    private String email;
    private String phone;
    private String delivery;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String productName;
    private String productCategory;
    private int quantity;

    private String status = "New";

    private LocalDateTime submittedAt = LocalDateTime.now();
}

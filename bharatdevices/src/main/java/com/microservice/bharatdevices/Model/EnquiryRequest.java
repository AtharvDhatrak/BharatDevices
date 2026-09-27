package com.microservice.bharatdevices.Model;

import lombok.Data;

@Data
public class EnquiryRequest {
    private String name;
    private String company;
    private String email;
    private String phone;
    private String delivery;
    private String message;
    private String productName;
    private String productCategory;
    private int quantity;
    private String enquiryId;
}

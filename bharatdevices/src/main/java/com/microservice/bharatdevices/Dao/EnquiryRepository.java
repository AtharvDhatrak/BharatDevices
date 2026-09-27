package com.microservice.bharatdevices.Dao;

import com.microservice.bharatdevices.Model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, String> {
    List<Enquiry> findAllByOrderBySubmittedAtDesc();
}

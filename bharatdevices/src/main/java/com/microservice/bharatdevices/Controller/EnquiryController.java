package com.microservice.bharatdevices.Controller;

import com.microservice.bharatdevices.Dao.EnquiryRepository;
import com.microservice.bharatdevices.Model.Enquiry;
import com.microservice.bharatdevices.Model.EnquiryRequest;
import com.microservice.bharatdevices.Services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/enquiry")
@RequiredArgsConstructor
public class EnquiryController {

    private final EmailService emailService;
    private final EnquiryRepository enquiryRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitEnquiry(@RequestBody EnquiryRequest request) {
        log.info("Enquiry received: {} from {}", request.getEnquiryId(), request.getEmail());
        try {
            // Save to database
            Enquiry enquiry = new Enquiry();
            String enquiryId = (request.getEnquiryId() != null && !request.getEnquiryId().trim().isEmpty())
                    ? request.getEnquiryId().trim()
                    : "BD-RFQ-" + System.currentTimeMillis();
            enquiry.setEnquiryId(enquiryId);
            enquiry.setName(request.getName());
            enquiry.setCompany(request.getCompany());
            enquiry.setEmail(request.getEmail());
            enquiry.setPhone(request.getPhone());
            enquiry.setDelivery(request.getDelivery());
            enquiry.setMessage(request.getMessage());
            enquiry.setProductName(request.getProductName());
            enquiry.setProductCategory(request.getProductCategory());
            enquiry.setQuantity(request.getQuantity());
            enquiry.setStatus("New");
            enquiry.setSubmittedAt(LocalDateTime.now());
            enquiryRepository.save(enquiry);

            // Send email notification (isolated so SMTP downtime/auth errors don't fail saving the enquiry)
            try {
                emailService.sendEnquiryEmail(request);
                log.info("Enquiry saved and email sent: {}", request.getEnquiryId());
            } catch (Exception mailEx) {
                log.error("Enquiry saved to DB ({}) but email sending failed: {}", 
                        request.getEnquiryId(), mailEx.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Enquiry submitted successfully",
                "enquiryId", request.getEnquiryId()
            ));
        } catch (Exception e) {
            log.error("Enquiry submission failed: {} - {}", request.getEnquiryId(), e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to submit enquiry: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEnquiries() {
        return ResponseEntity.ok(enquiryRepository.findAllByOrderBySubmittedAtDesc());
    }

    @GetMapping("/{enquiryId}")
    public ResponseEntity<?> getEnquiryById(@PathVariable String enquiryId) {
        return enquiryRepository.findById(enquiryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{enquiryId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String enquiryId, @RequestBody Map<String, String> body) {
        return enquiryRepository.findById(enquiryId).map(enquiry -> {
            enquiry.setStatus(body.get("status"));
            enquiryRepository.save(enquiry);
            return ResponseEntity.ok(Map.of("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}

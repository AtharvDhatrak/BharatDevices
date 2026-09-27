package com.microservice.bharatdevices.Services;

import com.microservice.bharatdevices.Model.EnquiryRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.to}")
    private String mailTo;

    @Value("${spring.mail.username}")
    private String mailFrom;

    public void sendEnquiryEmail(EnquiryRequest req) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(mailFrom);
        helper.setTo(mailTo);
        helper.setSubject("New Enquiry " + req.getEnquiryId() + " - " + req.getProductName());
        helper.setText(buildHtml(req), true);

        mailSender.send(message);
    }

    private String buildHtml(EnquiryRequest req) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <div style="background:#EA580C;padding:24px 32px;">
                <h2 style="color:#ffffff;margin:0;font-size:20px;">New Enquiry Received</h2>
                <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Enquiry ID: <strong>%s</strong></p>
              </div>
              <div style="padding:28px 32px;background:#ffffff;">
                <h3 style="color:#EA580C;margin:0 0 16px;font-size:15px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Product Details</h3>
                <table style="width:100%%;border-collapse:collapse;margin-bottom:24px;">
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:40%%;">Product</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Category</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Quantity</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%d</td></tr>
                </table>
                <h3 style="color:#EA580C;margin:0 0 16px;font-size:15px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Customer Details</h3>
                <table style="width:100%%;border-collapse:collapse;margin-bottom:24px;">
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:40%%;">Name</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Company</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Delivery Location</td><td style="padding:6px 0;font-weight:600;font-size:13px;">%s</td></tr>
                </table>
                %s
              </div>
              <div style="background:#f8fafc;padding:16px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Bharat Devices — Quality Electronics. Smarter Solutions.</p>
              </div>
            </div>
            """.formatted(
                req.getEnquiryId(),
                req.getProductName(), req.getProductCategory(), req.getQuantity(),
                req.getName(), req.getCompany(), req.getEmail(), req.getPhone(), req.getDelivery(),
                (req.getMessage() != null && !req.getMessage().isBlank())
                    ? """
                      <h3 style="color:#EA580C;margin:0 0 12px;font-size:15px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Message / Requirement</h3>
                      <p style="background:#f8fafc;padding:14px;border-radius:8px;font-size:13px;color:#374151;margin:0;">%s</p>
                      """.formatted(req.getMessage())
                    : ""
        );
    }
}

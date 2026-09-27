package com.microservice.bharatdevices.Controller;

import com.microservice.bharatdevices.Dao.BrandRepository;
import com.microservice.bharatdevices.Model.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/base")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    @PostMapping("/saveBrand")
    public ResponseEntity<Map<String, Object>> saveBrand(@RequestBody Brand brand) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (brand.getName() == null || brand.getName().isBlank()) {
                response.put("success", false);
                response.put("message", "Brand name is required.");
                return ResponseEntity.badRequest().body(response);
            }
            if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
                response.put("success", false);
                response.put("message", "Brand '" + brand.getName() + "' already exists.");
                return ResponseEntity.badRequest().body(response);
            }
            Brand saved = brandRepository.save(brand);
            response.put("success", true);
            response.put("data", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to save brand: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/getBrands")
    public ResponseEntity<Map<String, Object>> getBrands() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", brandRepository.findAllByOrderByNameAsc());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}

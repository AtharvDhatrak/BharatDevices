package com.microservice.bharatdevices.Controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.microservice.bharatdevices.Model.MenuDTO;
import com.microservice.bharatdevices.Model.ProductSaveRequest;
import com.microservice.bharatdevices.Services.BaseService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/base")
public class BaseController {

    private static final Logger log = LoggerFactory.getLogger(BaseController.class);

    @Autowired
    private BaseService baseService;

    @GetMapping("/menus")
    public ResponseEntity<Map<String, Object>> getMenusByRole(@RequestParam(defaultValue = "USR") String role) {
        log.info("Entering Base Controller ---> getMenusByRole with role: {}", role);

        try {
            List<MenuDTO> menus = baseService.getMenusForRole(role);
            log.info("Successfully returned {} root navigation nodes for role: {}", menus.size(), role);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", menus);
            log.info("Exiting Base Controller ---> getMenusByRole");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to process navigation menus for role {}: ", role, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve navigation menus");
            log.info("Exiting Base Controller ---> getMenusByRole with and error {}", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
@GetMapping("/getCategories")
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        log.info("Entering BaseController ---> getAllCategories");
        try {
            List<?> categories = baseService.getAllCategories();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", categories);
            log.info("Successfully returned {} categories", categories.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching category schemas: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/saveCategory")
    public ResponseEntity<Map<String, Object>> saveCategorySchema(@RequestBody Map<String, Object> payload) {
        log.info("Entering BaseController ---> saveCategorySchema for ID: {}", payload.get("id"));
        try {
            Object savedCategory = baseService.saveCategory(payload);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", savedCategory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving category schema: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/saveProduct")
    public ResponseEntity<Map<String, Object>> saveProduct(@RequestBody ProductSaveRequest payload) {
        log.info("Entering BaseController ---> saveProduct for title: {}", payload.getName());
        try {
            Object savedProduct = baseService.saveProduct(payload);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product and variants saved successfully");
            response.put("data", savedProduct);
            log.info("Successfully saved product: {}", payload.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving product: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

   @GetMapping("/getProducts")
    public ResponseEntity<Map<String, Object>> getProducts() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Controller calls Service (NOT DAO)
            List<Map<String, Object>> products = baseService.getProductsService();
            
            response.put("success", true);
            response.put("data", products);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
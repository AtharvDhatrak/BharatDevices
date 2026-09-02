package com.microservice.bharatdevices.Controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.microservice.bharatdevices.Model.MenuDTO;
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
}
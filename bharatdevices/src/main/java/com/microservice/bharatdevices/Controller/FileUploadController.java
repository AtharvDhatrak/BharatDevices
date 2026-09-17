package com.microservice.bharatdevices.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.microservice.bharatdevices.Services.FileUploadService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*") 
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", required = false, defaultValue = "products/general") String folder) {
        try {
            List<String> uploadedUrls = fileUploadService.uploadMultipleFiles(files, folder);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Files uploaded successfully to Cloudinary",
                    "urls", uploadedUrls
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/products/{productId}/images")
    public ResponseEntity<?> updateProductImages(
            @PathVariable Long productId,
            @RequestParam(value = "deletePublicIds", required = false) List<String> deletePublicIds,
            @RequestParam(value = "newFiles", required = false) List<MultipartFile> newFiles,
            @RequestParam(value = "folderName", required = false) String folderName) {
        try {
            Map<String, Object> updatedProduct = fileUploadService.updateImages(productId, deletePublicIds, newFiles, folderName);
            return ResponseEntity.ok(Map.of("success", true, "data", updatedProduct, "message", "Product images updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}

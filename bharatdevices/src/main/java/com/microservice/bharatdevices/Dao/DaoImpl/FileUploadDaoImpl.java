package com.microservice.bharatdevices.Dao.DaoImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.bharatdevices.Dao.FileUploadDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class FileUploadDaoImpl implements FileUploadDao {

    private static final Logger log = LoggerFactory.getLogger(FileUploadDaoImpl.class);

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private JdbcTemplate jdbcTemplate;

        private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public Map<String, Object> uploadFile(MultipartFile file, String folderName) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String targetFolder = folderName != null ? folderName : "products/general";
        
        log.debug("Initiating file upload to Cloudinary. Filename: {}, Target Folder: {}, Size: {} bytes", 
                originalFilename, targetFolder, file.getSize());

        try {
            Map params = ObjectUtils.asMap(
                    "folder", targetFolder,
                    "resource_type", "auto"
            );
            
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            log.info("Successfully uploaded file '{}' to Cloudinary under folder '{}'. Public ID: {}", 
                    originalFilename, targetFolder, uploadResult.get("public_id"));
            
            return uploadResult;
        } catch (IOException e) {
            log.error("IO or network error while uploading file '{}' to Cloudinary: {}", originalFilename, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while uploading file '{}' to Cloudinary: {}", originalFilename, e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteFile(String publicId) throws IOException {
        log.debug("Initiating deletion for file with public ID: {} from Cloudinary", publicId);

        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            boolean isDeleted = "ok".equals(result.get("result"));

            if (isDeleted) {
                log.info("Successfully deleted file with public ID: {} from Cloudinary", publicId);
            } else {
                log.warn("Cloudinary file deletion returned non-ok result for public ID '{}': {}", publicId, result.get("result"));
            }

            return isDeleted;
        } catch (IOException e) {
            log.error("IO or network error while deleting file with public ID '{}' from Cloudinary: {}", publicId, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while deleting file with public ID '{}' from Cloudinary: {}", publicId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete file from Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> getImageUrls(Long productId) {
        log.debug("Fetching image URLs for productId: {} from database", productId);
        String sql = "SELECT image_urls FROM products WHERE id = ?";
        
        // Explicitly casting or mapping to resolve type ambiguity
        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                String jsonStr = rs.getString("image_urls");
                if (jsonStr != null && !jsonStr.trim().isEmpty()) {
                    try {
                        List<String> urls = objectMapper.readValue(jsonStr, new TypeReference<List<String>>() {});
                        log.debug("Successfully parsed {} image URLs for productId: {}", urls != null ? urls.size() : 0, productId);
                        return urls != null ? urls : new ArrayList<String>();
                    } catch (Exception e) {
                        log.error("Failed to parse JSON image URLs for productId {}: {}", productId, e.getMessage(), e);
                        return new ArrayList<String>();
                    }
                }
            }
            log.warn("No product found or image_urls is null for productId: {}", productId);
            return new ArrayList<String>();
        }, productId);
    }

    @Override
    public void updateImageUrls(Long productId, List<String> imageUrls) {
        log.debug("Updating image URLs in database for productId: {}. Total images: {}", productId, imageUrls != null ? imageUrls.size() : 0);
        try {
            String jsonStr = objectMapper.writeValueAsString(imageUrls);
            String sql = "UPDATE products SET image_urls = ?::jsonb WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, jsonStr, productId);
            
            if (rowsAffected > 0) {
                log.info("Successfully updated database image URLs for productId: {}", productId);
            } else {
                log.warn("No rows updated in database for productId: {}. Check if the ID exists.", productId);
            }
        } catch (Exception e) {
            log.error("Error updating image URLs in database for productId {}: {}", productId, e.getMessage(), e);
            throw new RuntimeException("Failed to update product image URLs in database: " + e.getMessage(), e);
        }
    }
}
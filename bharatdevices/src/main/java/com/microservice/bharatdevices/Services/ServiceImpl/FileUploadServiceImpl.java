package com.microservice.bharatdevices.Services.ServiceImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.bharatdevices.Dao.FileUploadDao;
import com.microservice.bharatdevices.Services.FileUploadService;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private static final Logger log = LoggerFactory.getLogger(FileUploadServiceImpl.class);

    @Autowired
    private FileUploadDao fileUploadDao;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<String> uploadMultipleFiles(MultipartFile[] files, String folderName) throws IOException {
        log.info("Starting batch upload of {} files to folder: {}", files != null ? files.length : 0, folderName);
        List<String> secureUrls = new ArrayList<>();
        
        if (files == null) return secureUrls;

        for (MultipartFile file : files) {
            try {
                Map<String, Object> uploadResult = fileUploadDao.uploadFile(file, folderName);
                String url = (String) uploadResult.get("secure_url");
                if (url != null) {
                    secureUrls.add(url);
                }
            } catch (Exception e) {
                log.error("Failed to upload individual file in batch: {}", file.getOriginalFilename(), e);
                throw e;
            }
        }
        log.info("Successfully completed batch upload. Total uploaded URLs: {}", secureUrls.size());
        return secureUrls;
    }

    @Override
    public Map<String, Object> uploadSingleFile(MultipartFile file, String folderName) throws IOException {
        log.info("Starting single file upload for: {} to folder: {}", file.getOriginalFilename(), folderName);
        return fileUploadDao.uploadFile(file, folderName);
    }

    @Override
    @Transactional
    public Map<String, Object> updateImages(Long productId, List<String> deletePublicIds, List<MultipartFile> newFiles, String folderName) {
        log.info("Processing image update request for productId: {}", productId);

        // 1. Fetch current image URLs using the custom DAO
        List<String> currentImageUrls = fileUploadDao.getImageUrls(productId);
        if (currentImageUrls == null) {
            currentImageUrls = new ArrayList<>();
        }

        // 2. Delete requested old images from Cloudinary
        if (deletePublicIds != null && !deletePublicIds.isEmpty()) {
            log.info("Attempting to delete {} images from Cloudinary for productId: {}", deletePublicIds.size(), productId);
            for (String publicId : deletePublicIds) {
                try {
                    boolean deleted = fileUploadDao.deleteFile(publicId);
                    if (deleted) {
                        currentImageUrls.removeIf(url -> url != null && url.contains(publicId));
                        log.debug("Successfully removed URL matching publicId: {} from active list", publicId);
                    } else {
                        log.warn("Cloudinary reported failure deleting publicId: {}", publicId);
                    }
                } catch (IOException e) {
                    log.error("IO Exception while deleting image with publicId: {} from Cloudinary", publicId, e);
                }
            }
        }

        // 3. Upload any new files to Cloudinary
        if (newFiles != null && !newFiles.isEmpty()) {
            log.info("Attempting to upload {} new files to Cloudinary for productId: {}", newFiles.size(), productId);
            for (MultipartFile file : newFiles) {
                try {
                    Map<String, Object> uploadResult = fileUploadDao.uploadFile(file, folderName);
                    String secureUrl = (String) uploadResult.get("secure_url");
                    if (secureUrl != null) {
                        currentImageUrls.add(secureUrl);
                        log.debug("Added new secure URL: {}", secureUrl);
                    }
                } catch (IOException e) {
                    log.error("IO Exception while uploading new file '{}' to Cloudinary", file.getOriginalFilename(), e);
                }
            }
        }

        // 4. Save updated list back to the database using the custom DAO update call
        fileUploadDao.updateImageUrls(productId, currentImageUrls);
        log.info("Successfully finalized image update process for productId: {}. Total active images: {}", productId, currentImageUrls.size());

        return Map.of("productId", productId, "image_urls", currentImageUrls);
    }
}
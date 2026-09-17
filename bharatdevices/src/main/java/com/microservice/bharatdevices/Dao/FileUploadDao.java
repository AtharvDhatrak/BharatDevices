package com.microservice.bharatdevices.Dao;

import com.cloudinary.Cloudinary;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FileUploadDao {
    Map<String, Object> uploadFile(MultipartFile file, String folderName) throws IOException;
    boolean deleteFile(String publicId) throws IOException;
    List<String> getImageUrls(Long productId);
    void updateImageUrls(Long productId, List<String> imageUrls);
}

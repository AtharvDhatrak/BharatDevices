package com.microservice.bharatdevices.Services;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FileUploadService {
    List<String> uploadMultipleFiles(MultipartFile[] files, String folderName) throws IOException;
    Map<String, Object> uploadSingleFile(MultipartFile file, String folderName) throws IOException;
    Map<String, Object> updateImages(Long productId, List<String> deletePublicIds, List<MultipartFile> newFiles, String folderName);
}
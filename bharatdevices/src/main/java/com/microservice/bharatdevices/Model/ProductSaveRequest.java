package com.microservice.bharatdevices.Model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data 
public class ProductSaveRequest {
    private String name; // mapped to title
    private String sku;
    private String brand;
    private String modelNumber;     // Updated to match frontend
    private String category;        // mapped to category_id
    private String subCategory;     // Added
    private Map<String, Object> specs; // mapped to specifications JSONB
    private List<VariantDTO> variants;
    private BigDecimal price;
    private Integer stock;
    private List<String> imageUrls;
    private String shortDescription; // Updated to match frontend
    private String detailedDescription; // Updated to match frontend
    private List<String> tags;      // Changed from java.sql.Array to List<String>
    private String slug;

    @Data
    public static class VariantDTO {
        private String sku;
        private Map<String, Object> combination; // variant_attributes JSONB
        private BigDecimal price; // wholesale_price
        private Integer stock; // stock_quantity
        private List<String> imageUrls;
    }
}
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
    private String category; // mapped to category_id
    private Map<String, Object> specs; // mapped to specifications JSONB
    private List<VariantDTO> variants;
    private BigDecimal price;
    private Integer stock;
    private List<String> imageUrls;
    
    @Data
    public static class VariantDTO {
        private String sku;
        private Map<String, Object> combination; // variant_attributes JSONB
        private BigDecimal price; // wholesale_price
        private Integer stock; // stock_quantity
        private List<String> imageUrls;

    }
}
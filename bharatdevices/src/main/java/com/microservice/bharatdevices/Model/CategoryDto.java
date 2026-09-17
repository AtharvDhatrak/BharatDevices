package com.microservice.bharatdevices.Model;

import java.util.List;
import lombok.Data;

@Data 
public class CategoryDto {
    private String id;
    private String name;
    private List<SpecDefinitionDto> specDefinitions;

    @Data
    public static class SpecDefinitionDto {
        private String key;
        private String label;
        private String type; 
        private List<String> options;
        private boolean isVariant;
        private boolean isRequired;
    }
}

package com.microservice.bharatdevices.Dao;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microservice.bharatdevices.Model.NavigationMenu;
import com.microservice.bharatdevices.Model.ProductSaveRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface BaseDao {
    List<NavigationMenu> fetchAllActiveMenus();
    List<Map<String, Object>> fetchAllCategories();
    void saveCategorySchema(Map<String, Object> payload);
    public void insertProduct(UUID productId, ProductSaveRequest request) throws JsonProcessingException;
    public void insertVariant(UUID productId, UUID variantId, ProductSaveRequest.VariantDTO variant) throws JsonProcessingException;
    public List<Map<String, Object>> fetchProductsFromDatabase();
    
}
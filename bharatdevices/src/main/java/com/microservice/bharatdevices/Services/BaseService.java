package com.microservice.bharatdevices.Services;

import java.util.List;
import java.util.Map;

import com.microservice.bharatdevices.Model.MenuDTO;
import com.microservice.bharatdevices.Model.ProductSaveRequest;

public interface BaseService {
    public List<MenuDTO> getMenusForRole(String roleCode);
    public List<?> getAllCategories();
    public Object saveCategory(Map<String, Object> payload);
    public Object saveProduct(ProductSaveRequest request) throws Exception;
    public List<Map<String, Object>> getProductsService();
    
}

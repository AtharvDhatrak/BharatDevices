package com.microservice.bharatdevices.Services.ServiceImpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.microservice.bharatdevices.Model.MenuDTO;
import com.microservice.bharatdevices.Model.NavigationMenu;
import com.microservice.bharatdevices.Model.ProductSaveRequest;
import com.microservice.bharatdevices.Services.BaseService;

import jakarta.transaction.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.bharatdevices.Dao.BaseDao;

@Service
public class BaseServiceImpl implements BaseService {

    private static final Logger log = LoggerFactory.getLogger(BaseServiceImpl.class);

    @Autowired
    private BaseDao baseDao;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<MenuDTO> getMenusForRole(String roleCode) {
        String targetRole = (roleCode != null) ? roleCode.toUpperCase().trim() : "USR";
        log.info("Processing menu tree hierarchy for role: {}", targetRole);

        List<NavigationMenu> rawMenus = baseDao.fetchAllActiveMenus();
        return buildMenuTree(rawMenus, targetRole);
    }

    private List<MenuDTO> buildMenuTree(List<NavigationMenu> rawMenus, String userRole) {
        Map<Long, MenuDTO> menuMap = new HashMap<>();
        List<MenuDTO> rootMenus = new ArrayList<>();

        // 1. Convert models to DTOs & filter by role
        for (NavigationMenu menu : rawMenus) {
            if (isMenuVisibleToRole(menu.getVisibleTo(), userRole)) {
                menuMap.put(menu.getId(), mapToDTO(menu));
            }
        }

        // 2. Build parent-child relationships
        for (MenuDTO dto : menuMap.values()) {
            if (dto.getParentId() != null && menuMap.containsKey(dto.getParentId())) {
                menuMap.get(dto.getParentId()).getChildren().add(dto);
            } else if (dto.getParentId() == null) {
                rootMenus.add(dto);
            }
        }

        return rootMenus;
    }

    private boolean isMenuVisibleToRole(String visibleTo, String userRole) {
        if (visibleTo == null || visibleTo.equalsIgnoreCase("ALL")) {
            return true;
        }
        List<String> allowedRoles = Arrays.asList(visibleTo.split("\\s*,\\s*"));
        return allowedRoles.contains(userRole);
    }

    private MenuDTO mapToDTO(NavigationMenu entity) {
        MenuDTO dto = new MenuDTO();
        dto.setId(entity.getId());
        dto.setParentId(entity.getParentId());
        dto.setTitle(entity.getTitle());
        dto.setSlug(entity.getSlug());
        dto.setPath(entity.getPath());
        dto.setIcon(entity.getIcon());
        dto.setDisplayOrder(entity.getDisplayOrder());
        dto.setVisibleTo(entity.getVisibleTo());
        return dto;
    }
 
    public List<Map<String, Object>> getAllCategories() {
        return baseDao.fetchAllCategories();
    }

    public Object saveCategory(Map<String, Object> payload) {
        String categoryId = (String) payload.get("id");
        if (categoryId == null || categoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("Category ID is required");
        }
        
        baseDao.saveCategorySchema(payload);
        return payload; 
    }

    @Override
    @Transactional
    public Object saveProduct(ProductSaveRequest request) throws Exception {
        log.info("Initiating product save process for: {}", request.getName());

        UUID productId = UUID.randomUUID();

        // 1. Delegate product persistence to DAO
        baseDao.insertProduct(productId, request);

        // 2. Delegate variants persistence to DAO if variants exist
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductSaveRequest.VariantDTO variant : request.getVariants()) {
                UUID variantId = UUID.randomUUID();
                baseDao.insertVariant(productId, variantId, variant);
            }
        }

        log.info("Successfully completed product transaction for ID: {}", productId);
        return Map.of("productId", productId.toString());
    }

    @Override 
    public List<Map<String, Object>> getProductsService() {
        return baseDao.fetchProductsFromDatabase();
    }
}

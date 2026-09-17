package com.microservice.bharatdevices.Dao.DaoImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.bharatdevices.Dao.BaseDao;
import com.microservice.bharatdevices.Model.NavigationMenu;
import com.microservice.bharatdevices.Model.ProductSaveRequest;

@Repository
public class BaseDaoImpl implements BaseDao {

    private static final Logger log = LoggerFactory.getLogger(BaseDaoImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<NavigationMenu> fetchAllActiveMenus() {
        String sql = "SELECT id, parent_id, title, slug, path, icon, display_order, is_active, visible_to " +
                     "FROM navigation_menus WHERE is_active = TRUE ORDER BY display_order ASC";

        log.debug("Executing query to fetch active menus: {}", sql);

        try {
            List<NavigationMenu> menus = jdbcTemplate.query(sql, (rs, rowNum) -> {
                NavigationMenu menu = new NavigationMenu();
                menu.setId(rs.getLong("id"));
                
                long parentId = rs.getLong("parent_id");
                menu.setParentId(rs.wasNull() ? null : parentId);
                
                menu.setTitle(rs.getString("title"));
                menu.setSlug(rs.getString("slug"));
                menu.setPath(rs.getString("path"));
                menu.setIcon(rs.getString("icon"));
                menu.setDisplayOrder(rs.getInt("display_order"));
                menu.setVisibleTo(rs.getString("visible_to"));
                return menu;
            });
            log.info("Successfully fetched {} active menus", menus.size());
            return menus;
        } catch (Exception e) {
            log.error("Database error while fetching active menus: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch active menus", e);
        }
    }

    @Override
    public List<Map<String, Object>> fetchAllCategories() {
        String sql = "SELECT id, name, spec_definitions FROM categories";
        log.debug("Executing query to fetch all categories: {}", sql);
        
        try {
            List<Map<String, Object>> categories = jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> category = new java.util.HashMap<>();
                String categoryId = rs.getString("id");
                category.put("id", categoryId);
                category.put("name", rs.getString("name"));
                
                String specDefsJson = rs.getString("spec_definitions");
                try {
                    if (specDefsJson != null) {
                        List<?> specs = objectMapper.readValue(specDefsJson, List.class);
                        category.put("specDefinitions", specs);
                    } else {
                        category.put("specDefinitions", new java.util.ArrayList<>());
                    }
                } catch (JsonProcessingException jpe) {
                    log.warn("Failed to parse spec_definitions JSON for category ID: {}. Reason: {}", categoryId, jpe.getMessage());
                    category.put("specDefinitions", new java.util.ArrayList<>());
                }
                
                return category;
            });
            log.info("Successfully fetched {} categories", categories.size());
            return categories;
        } catch (Exception e) {
            log.error("Database error while fetching categories: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch categories", e);
        }
    }

    @Override
    public void saveCategorySchema(Map<String, Object> payload) {
        String id = (String) payload.get("id");
        String name = (String) payload.get("name");
        Object specDefinitions = payload.get("specDefinitions");

        log.debug("Attempting to save category schema with ID: {}, Name: {}", id, name);

        try {
            String specDefsJson = objectMapper.writeValueAsString(specDefinitions);
            String sql = "INSERT INTO categories (id, name, spec_definitions) VALUES (?, ?, ?::jsonb) " +
                         "ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, spec_definitions = EXCLUDED.spec_definitions";

            jdbcTemplate.update(sql, id, name, specDefsJson);
            log.info("Successfully saved/updated category schema with ID: {}", id);

        } catch (JsonProcessingException jpe) {
            log.error("JSON serialization failed for specDefinitions of category ID {}: {}", id, jpe.getMessage(), jpe);
            throw new RuntimeException("Failed to serialize category spec definitions: " + jpe.getMessage(), jpe);
        } catch (Exception e) {
            log.error("Database error while saving category schema (ID: {}): {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to save category schema to database: " + e.getMessage(), e);
        }
    }

    @Override
public void insertProduct(UUID productId, ProductSaveRequest request) throws JsonProcessingException {
    // 1. Serialize Specs
    String specsJson = objectMapper.writeValueAsString(request.getSpecs() != null ? request.getSpecs() : Map.of());
    
    // 2. Serialize General Image URLs
    String imagesJson = objectMapper.writeValueAsString(request.getImageUrls() != null ? request.getImageUrls() : List.of());

    String normalizedCategory = request.getCategory() != null ? request.getCategory().toLowerCase() : null;

    // Added image_urls to the query
    String insertProductQuery = "INSERT INTO public.products (id, title, brand, category_id, specifications, image_urls) VALUES (?, ?, ?, ?, ?::jsonb, ?::jsonb)";
    
    try {
        jdbcTemplate.update(insertProductQuery,
                productId,
                request.getName(),
                request.getBrand(),
                normalizedCategory,
                specsJson,
                imagesJson // <-- Passed as JSONB
        );
        log.info("Successfully inserted product with images into database, ID: {}", productId);
    } catch (Exception e) {
        log.error("Database insertion failed for product ID {}: {}", productId, e.getMessage(), e);
        throw new RuntimeException("Database error during product insertion: " + e.getMessage(), e);
    }
}

@Override
public void insertVariant(UUID productId, UUID variantId, ProductSaveRequest.VariantDTO variant) throws JsonProcessingException {
    // 1. Serialize Attribute Combination
    String attrsJson = objectMapper.writeValueAsString(variant.getCombination() != null ? variant.getCombination() : Map.of());
    
    // 2. Serialize Variant-specific Image URLs
    String variantImagesJson = objectMapper.writeValueAsString(variant.getImageUrls() != null ? variant.getImageUrls() : List.of());

    // Added image_urls to the query
    String insertVariantQuery = "INSERT INTO public.product_variants (id, product_id, sku, variant_attributes, wholesale_price, stock_quantity, image_urls) VALUES (?, ?, ?, ?::jsonb, ?, ?, ?::jsonb)";
    
    try {
        jdbcTemplate.update(insertVariantQuery,
                variantId,
                productId,
                variant.getSku(),
                attrsJson,
                variant.getPrice(),
                variant.getStock() != null ? variant.getStock() : 0,
                variantImagesJson // <-- Passed as JSONB
        );
        log.info("Successfully inserted variant ID: {} with matrix images for product ID: {}", variantId, productId);
    } catch (Exception e) {
        log.error("Database insertion failed for variant ID {}: {}", variantId, e.getMessage(), e);
        throw new RuntimeException("Database error during variant insertion: " + e.getMessage(), e);
    }
}


    @Override 
public List<Map<String, Object>> fetchProductsFromDatabase() {
    // Join products with product_variants to pull variant specifications, pricing, and stock
    String sql = "SELECT p.id as product_id, p.title, p.brand, p.category_id, p.specifications, p.image_urls,p.created_at, " +
                 "v.id as variant_id, v.sku as variant_sku, v.variant_attributes, v.wholesale_price, v.stock_quantity, v.image_urls as variant_images " +
                 "FROM products p LEFT JOIN product_variants v ON p.id = v.product_id";

    List<Map<String, Object>> flatRows = jdbcTemplate.queryForList(sql);
    
    // Group flat SQL rows by product_id so variants are nested inside an array
    Map<String, Map<String, Object>> productMap = new LinkedHashMap<>();

    for (Map<String, Object> row : flatRows) {
        String productId = String.valueOf(row.get("product_id"));

        productMap.putIfAbsent(productId, new HashMap<>(Map.of(
            "id", productId,
            "title", row.get("title"),
            "brand", row.get("brand"),
            "category_id", row.get("category_id"),
            "specifications", row.get("specifications"),
            "image_urls", row.get("image_urls"),
            "created_at", row.get("created_at"),
            "variants", new ArrayList<Map<String, Object>>()
        )));

        // If a variant exists for this row, add it to the product's variants list
        if (row.get("variant_id") != null) {
            Map<String, Object> variant = new HashMap<>();
            variant.put("id", row.get("variant_id"));
            variant.put("sku", row.get("variant_sku"));
            variant.put("combination", row.get("variant_attributes"));
            variant.put("price", row.get("wholesale_price")); // <--- Variant specific price
            variant.put("stock", row.get("stock_quantity"));
            variant.put("imageUrls", row.get("variant_images"));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> variantsList = (List<Map<String, Object>>) productMap.get(productId).get("variants");
            variantsList.add(variant);
        }
    }

    return new ArrayList<>(productMap.values());
}
}
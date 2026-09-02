package com.microservice.bharatdevices.Model;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NavigationMenu {
    private Long id;
    private Long parentId;
    private String title;
    private String slug;
    private String path;
    private String icon;
    private Integer displayOrder;
    private Boolean isActive;
    private String visibleTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
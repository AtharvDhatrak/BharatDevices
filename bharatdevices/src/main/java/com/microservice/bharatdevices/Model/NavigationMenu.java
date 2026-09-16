package com.microservice.bharatdevices.Model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    
    // 1. Initialize immediately so it is never null
    // 2. Add @JsonInclude to avoid serializing empty lists if desired
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<NavigationMenu> children = new ArrayList<>();

    // Custom helper method for tree building
    public void addChild(NavigationMenu child) {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(child);
    }
}
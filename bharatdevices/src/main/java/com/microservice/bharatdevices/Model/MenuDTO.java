package com.microservice.bharatdevices.Model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class MenuDTO {

    private Long id;
    private Long parentId;
    private String title;
    private String slug;
    private String path;
    private String icon;
    private Integer displayOrder;
    private String visibleTo;
    private List<MenuDTO> children = new ArrayList<>();

    public MenuDTO() {
    }

    public MenuDTO(Long id, Long parentId, String title, String slug, String path, String icon, Integer displayOrder, String visibleTo, List<MenuDTO> children) {
        this.id = id;
        this.parentId = parentId;
        this.title = title;
        this.slug = slug;
        this.path = path;
        this.icon = icon;
        this.displayOrder = displayOrder;
        this.visibleTo = visibleTo;
        this.children = children;
    }

}
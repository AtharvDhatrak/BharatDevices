package com.microservice.bharatdevices.Model;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
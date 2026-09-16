package com.microservice.bharatdevices.Dao.DaoImpl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.microservice.bharatdevices.Dao.BaseDao;
import com.microservice.bharatdevices.Model.NavigationMenu;

@Repository
public class BaseDaoImpl implements BaseDao {

    private static final Logger log = LoggerFactory.getLogger(BaseDaoImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

  @Override
public List<NavigationMenu> fetchAllActiveMenus() {
    String sql = "SELECT id, parent_id, title, slug, path, icon, display_order, is_active, visible_to " +
                 "FROM navigation_menus WHERE is_active = TRUE ORDER BY display_order ASC";

    List<NavigationMenu> flatList = jdbcTemplate.query(sql, (rs, rowNum) -> {
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
        menu.setChildren(new ArrayList<>());
        return menu;
    });

    // Step 1: Map all items by ID for quick parent lookups
    Map<Long, NavigationMenu> menuMap = flatList.stream()
            .collect(Collectors.toMap(
                NavigationMenu::getId, 
                menu -> menu,
                (existing, replacement) -> existing, 
                LinkedHashMap::new
            ));

    // Step 2: Attach children to parents and collect roots
    List<NavigationMenu> rootMenus = new ArrayList<>();

    for (NavigationMenu item : flatList) {
        if (item.getParentId() == null) {
            rootMenus.add(item);
        } else {
            NavigationMenu parent = menuMap.get(item.getParentId());
            if (parent != null) {
                parent.getChildren().add(item);
            }
        }
    }

    return rootMenus;
}
    
}

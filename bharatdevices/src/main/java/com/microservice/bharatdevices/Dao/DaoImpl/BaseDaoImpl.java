package com.microservice.bharatdevices.Dao.DaoImpl;

import java.util.List;
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
        log.info("Executing database query to fetch active navigation menus");
        String sql = "SELECT id, parent_id, title, slug, path, icon, display_order, is_active, visible_to " +
                     "FROM navigation_menus WHERE is_active = TRUE ORDER BY display_order ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            NavigationMenu menu = new NavigationMenu();
            menu.setId(rs.getLong("id"));
            long pId = rs.getLong("parent_id");
            menu.setParentId(rs.wasNull() ? null : pId);
            menu.setTitle(rs.getString("title"));
            menu.setSlug(rs.getString("slug"));
            menu.setPath(rs.getString("path"));
            menu.setIcon(rs.getString("icon"));
            menu.setDisplayOrder(rs.getInt("display_order"));
            menu.setIsActive(rs.getBoolean("is_active"));
            menu.setVisibleTo(rs.getString("visible_to"));
            return menu;
        });
    }
    
}

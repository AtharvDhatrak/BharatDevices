package com.microservice.bharatdevices.Dao;

import com.microservice.bharatdevices.Model.NavigationMenu;
import java.util.List;

public interface BaseDao {
    List<NavigationMenu> fetchAllActiveMenus();
}
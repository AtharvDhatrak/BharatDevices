package com.microservice.bharatdevices.Services;

import java.util.List;

import com.microservice.bharatdevices.Model.MenuDTO;

public interface BaseService {
    public List<MenuDTO> getMenusForRole(String roleCode);

}

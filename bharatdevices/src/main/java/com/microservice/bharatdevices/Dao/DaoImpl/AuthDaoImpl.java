package com.microservice.bharatdevices.Dao.DaoImpl;

import com.microservice.bharatdevices.Dao.AuthDao;
import com.microservice.bharatdevices.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AuthDaoImpl implements AuthDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> profileRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId((UUID) rs.getObject("id"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password")); // <--- FIXED: Map password column
        user.setRole(rs.getString("portal"));
        user.setProvider(rs.getString("auth_provider"));
        return user;
    };

    @Override
    public Optional<User> findByIdentifier(String identifier) {
        String sql = "SELECT * FROM public.profiles WHERE email = ? OR username = ?";
        return jdbcTemplate.query(sql, profileRowMapper, identifier, identifier)
                           .stream()
                           .findFirst();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM public.profiles WHERE username = ?";
        return jdbcTemplate.query(sql, profileRowMapper, username)
                           .stream()
                           .findFirst();
    }

    @Override
    public User saveUser(User user) {
        // FIXED: Added password column to INSERT query
        String sql = "INSERT INTO public.profiles (full_name, username, email, password, portal, auth_provider) " +
                     "VALUES (?, ?, ?, ?, ?::portal_type, ?::auth_provider_type)";
                     
        jdbcTemplate.update(sql, 
                user.getFullName(), 
                user.getUsername(), 
                user.getEmail(), 
                user.getPassword(), // <--- FIXED: Pass hashed password
                user.getRole() != null ? user.getRole() : "USER", 
                user.getProvider() != null ? user.getProvider() : "LOCAL");
                
        return user;
    }

    @Override
    public void saveOtp(String identifier, String otp) {
        String sql = "INSERT INTO public.otp_verification (identifier, otp) VALUES (?, ?) " +
                     "ON CONFLICT (identifier) DO UPDATE SET otp = EXCLUDED.otp, created_at = NOW()";
        jdbcTemplate.update(sql, identifier, otp);
    }

    @Override
    public Optional<String> getOtpByIdentifier(String identifier) {
        String sql = "SELECT otp FROM public.otp_verification WHERE LOWER(TRIM(identifier)) = LOWER(TRIM(?))";
        try {
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("otp"), identifier);
            if (results.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(results.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void deleteOtp(String identifier) {
        String sql = "DELETE FROM public.otp_verification WHERE identifier = ?";
        jdbcTemplate.update(sql, identifier);
    }
}
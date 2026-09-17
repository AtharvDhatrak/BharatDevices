package com.microservice.bharatdevices.Dao.DaoImpl;

import com.microservice.bharatdevices.Dao.AuthDao;
import com.microservice.bharatdevices.Model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AuthDaoImpl implements AuthDao {

    private static final Logger log = LoggerFactory.getLogger(AuthDaoImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> profileRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId((UUID) rs.getObject("id"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setRole(rs.getString("portal"));
        user.setProvider(rs.getString("auth_provider"));
        return user;
    };

    @Override
    public Optional<User> findByIdentifier(String identifier) {
        String sql = "SELECT * FROM public.profiles WHERE email = ? OR username = ?";
        log.debug("Executing findByIdentifier query for identifier: {}", identifier);

        try {
            List<User> results = jdbcTemplate.query(sql, profileRowMapper, identifier, identifier);
            Optional<User> user = results.stream().findFirst();
            
            if (user.isPresent()) {
                log.info("Successfully found user profile by identifier: {}", identifier);
            } else {
                log.warn("No user profile found for identifier: {}", identifier);
            }
            return user;
        } catch (Exception e) {
            log.error("Database error while finding user by identifier '{}': {}", identifier, e.getMessage(), e);
            throw new RuntimeException("Failed to find user by identifier", e);
        }
    }

    @Override
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM public.profiles WHERE username = ?";
        log.debug("Executing findByUsername query for username: {}", username);

        try {
            List<User> results = jdbcTemplate.query(sql, profileRowMapper, username);
            Optional<User> user = results.stream().findFirst();

            if (user.isPresent()) {
                log.info("Successfully found user profile by username: {}", username);
            } else {
                log.warn("No user profile found for username: {}", username);
            }
            return user;
        } catch (Exception e) {
            log.error("Database error while finding user by username '{}': {}", username, e.getMessage(), e);
            throw new RuntimeException("Failed to find user by username", e);
        }
    }

    @Override
    public User saveUser(User user) {
        String sql = "INSERT INTO public.profiles (full_name, username, email, password, portal, auth_provider) " +
                     "VALUES (?, ?, ?, ?, ?::portal_type, ?::auth_provider_type)";
                     
        log.debug("Attempting to save new user profile with username: {} and email: {}", user.getUsername(), user.getEmail());

        try {
            jdbcTemplate.update(sql, 
                    user.getFullName(), 
                    user.getUsername(), 
                    user.getEmail(), 
                    user.getPassword(), 
                    user.getRole() != null ? user.getRole() : "USER", 
                    user.getProvider() != null ? user.getProvider() : "LOCAL"
            );
            
            log.info("Successfully saved user profile for username: {}", user.getUsername());
            return user;
        } catch (Exception e) {
            log.error("Database error while saving user profile (Username: {}, Email: {}): {}", 
                    user.getUsername(), user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to save user profile: " + e.getMessage(), e);
        }
    }

    @Override
    public void saveOtp(String identifier, String otp) {
        String sql = "INSERT INTO public.otp_verification (identifier, otp) VALUES (?, ?) " +
                     "ON CONFLICT (identifier) DO UPDATE SET otp = EXCLUDED.otp, created_at = NOW()";
                     
        log.debug("Attempting to save/update OTP for identifier: {}", identifier);

        try {
            jdbcTemplate.update(sql, identifier, otp);
            log.info("Successfully saved/updated OTP for identifier: {}", identifier);
        } catch (Exception e) {
            log.error("Database error while saving OTP for identifier '{}': {}", identifier, e.getMessage(), e);
            throw new RuntimeException("Failed to save OTP verification record", e);
        }
    }

    @Override
    public Optional<String> getOtpByIdentifier(String identifier) {
        String sql = "SELECT otp FROM public.otp_verification WHERE LOWER(TRIM(identifier)) = LOWER(TRIM(?))";
        log.debug("Fetching OTP for identifier: {}", identifier);

        try {
            List<String> results = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("otp"), identifier);
            if (results.isEmpty()) {
                log.warn("No OTP record found for identifier: {}", identifier);
                return Optional.empty();
            }
            log.info("Successfully retrieved OTP for identifier: {}", identifier);
            return Optional.of(results.get(0));
        } catch (Exception e) {
            log.error("Database error while retrieving OTP for identifier '{}': {}", identifier, e.getMessage(), e);
            return Optional.empty();
        }
    }

    @Override
    public void deleteOtp(String identifier) {
        String sql = "DELETE FROM public.otp_verification WHERE identifier = ?";
        log.debug("Attempting to delete OTP record for identifier: {}", identifier);

        try {
            int rowsAffected = jdbcTemplate.update(sql, identifier);
            if (rowsAffected > 0) {
                log.info("Successfully deleted OTP record for identifier: {}", identifier);
            } else {
                log.debug("No active OTP record found to delete for identifier: {}", identifier);
            }
        } catch (Exception e) {
            log.error("Database error while deleting OTP for identifier '{}': {}", identifier, e.getMessage(), e);
            throw new RuntimeException("Failed to delete OTP verification record", e);
        }
    }
}
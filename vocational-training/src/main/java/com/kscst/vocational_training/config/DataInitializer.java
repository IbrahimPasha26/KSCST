package com.kscst.vocational_training.config;

import com.kscst.vocational_training.model.Admin;
import com.kscst.vocational_training.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin if not exists
        if (adminRepository.findByUsername("Admin User") == null) {
            Admin admin = new Admin();
            admin.setUsername("Admin User");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("Admin User");
            admin.setEmail("admin@gmail.com");
            admin.setRole("ADMIN");
            adminRepository.save(admin);
            System.out.println("Default admin created: Admin User");
        }
    }
}
package com.kscst.vocational_training.security;

import com.kscst.vocational_training.model.Admin;
import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import com.kscst.vocational_training.repository.AdminRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/trainer/**").hasRole("TRAINER")
                        .anyRequest().authenticated()
                )
                .httpBasic();
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(TraineeRepository traineeRepository, TrainerRepository trainerRepository, AdminRepository adminRepository) {
        return username -> {
            Trainee trainee = traineeRepository.findByUsername(username);
            if (trainee != null) {
                return org.springframework.security.core.userdetails.User
                        .withUsername(trainee.getUsername())
                        .password(trainee.getPassword())
                        .roles(trainee.getRole())
                        .build();
            }
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer != null) {
                return org.springframework.security.core.userdetails.User
                        .withUsername(trainer.getUsername())
                        .password(trainer.getPassword())
                        .roles(trainer.getRole())
                        .build();
            }
            Admin admin = adminRepository.findByUsername(username);
            if (admin != null) {
                return org.springframework.security.core.userdetails.User
                        .withUsername(admin.getUsername())
                        .password(admin.getPassword())
                        .roles(admin.getRole())
                        .build();
            }
            throw new UsernameNotFoundException("User not found: " + username);
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
package com.kscst.vocational_training.security;

import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.model.Admin;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import com.kscst.vocational_training.repository.AdminRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final TraineeRepository traineeRepository;
    private final TrainerRepository trainerRepository;
    private final AdminRepository adminRepository;

    public SecurityConfig(
            TraineeRepository traineeRepository,
            TrainerRepository trainerRepository,
            AdminRepository adminRepository) {
        this.traineeRepository = traineeRepository;
        this.trainerRepository = trainerRepository;
        this.adminRepository = adminRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/trainer/**").hasRole("TRAINER")
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {});
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Trainee trainee = traineeRepository.findByUsername(username);
            if (trainee != null) {
                return User.builder()
                        .username(trainee.getUsername())
                        .password(trainee.getPassword())
                        .roles(trainee.getRole())
                        .build();
            }
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer != null) {
                return User.builder()
                        .username(trainer.getUsername())
                        .password(trainer.getPassword())
                        .roles(trainer.getRole())
                        .build();
            }
            Admin admin = adminRepository.findByUsername(username);
            if (admin != null) {
                return User.builder()
                        .username(admin.getUsername())
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
}
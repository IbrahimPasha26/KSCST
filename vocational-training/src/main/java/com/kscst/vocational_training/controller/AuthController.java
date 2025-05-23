package com.kscst.vocational_training.controller;

import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.model.Admin;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import com.kscst.vocational_training.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/trainee/register")
    public ResponseEntity<String> registerTrainee(@RequestBody Trainee trainee) {
        if (traineeRepository.findByUsername(trainee.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        trainee.setPassword(passwordEncoder.encode(trainee.getPassword()));
        trainee.setRole("TRAINEE");
        trainee.setStatus("PENDING");
        traineeRepository.save(trainee);
        return ResponseEntity.ok("Trainee registered successfully. Awaiting admin approval.");
    }

    @PostMapping("/trainer/register")
    public ResponseEntity<String> registerTrainer(@RequestBody Trainer trainer) {
        if (trainerRepository.findByUsername(trainer.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        trainer.setPassword(passwordEncoder.encode(trainer.getPassword()));
        trainer.setRole("TRAINER");
        trainer.setStatus("PENDING");
        trainerRepository.save(trainer);
        return ResponseEntity.ok("Trainer registered successfully. Awaiting admin approval.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Trainee trainee = traineeRepository.findByUsername(loginRequest.getUsername());
        if (trainee != null && passwordEncoder.matches(loginRequest.getPassword(), trainee.getPassword())) {
            if (!trainee.getStatus().equals("APPROVED")) {
                return ResponseEntity.badRequest().body("Account not approved. Please contact admin.");
            }
            return ResponseEntity.ok(new LoginResponse(trainee.getId(), trainee.getUsername(), trainee.getRole()));
        }
        Trainer trainer = trainerRepository.findByUsername(loginRequest.getUsername());
        if (trainer != null && passwordEncoder.matches(loginRequest.getPassword(), trainer.getPassword())) {
            if (!trainer.getStatus().equals("APPROVED")) {
                return ResponseEntity.badRequest().body("Account not approved. Please contact admin.");
            }
            return ResponseEntity.ok(new LoginResponse(trainer.getId(), trainer.getUsername(), trainer.getRole()));
        }
        Admin admin = adminRepository.findByUsername(loginRequest.getUsername());
        if (admin != null && passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            return ResponseEntity.ok(new LoginResponse(admin.getId(), admin.getUsername(), admin.getRole()));
        }
        return ResponseEntity.badRequest().body("Invalid username or password");
    }
}

class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginResponse {
    private String id;
    private String username;
    private String role;

    public LoginResponse(String id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
package com.kscst.vocational_training.controller;

import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @GetMapping("/trainees")
    public List<Trainee> getAllTrainees() {
        return traineeRepository.findAll();
    }

    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @DeleteMapping("/trainee/{id}")
    public ResponseEntity<String> deleteTrainee(@PathVariable String id) {
        if (traineeRepository.existsById(id)) {
            traineeRepository.deleteById(id);
            return ResponseEntity.ok("Trainee deleted successfully");
        }
        return ResponseEntity.badRequest().body("Trainee not found");
    }

    @DeleteMapping("/trainer/{id}")
    public ResponseEntity<String> deleteTrainer(@PathVariable String id) {
        if (trainerRepository.existsById(id)) {
            trainerRepository.deleteById(id);
            return ResponseEntity.ok("Trainer deleted successfully");
        }
        return ResponseEntity.badRequest().body("Trainer not found");
    }

    @PutMapping("/trainee/approve/{id}")
    public ResponseEntity<String> approveTrainee(@PathVariable String id, @RequestBody TrainerAssignmentRequest request) {
        Trainee trainee = traineeRepository.findById(id).orElse(null);
        if (trainee == null) {
            return ResponseEntity.badRequest().body("Trainee not found");
        }
        if (!trainerRepository.existsById(request.getTrainerId())) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        trainee.setStatus("APPROVED");
        trainee.setAssignedTrainerId(request.getTrainerId());
        traineeRepository.save(trainee);
        return ResponseEntity.ok("Trainee approved and assigned to trainer");
    }

    @PutMapping("/trainee/reject/{id}")
    public ResponseEntity<String> rejectTrainee(@PathVariable String id) {
        Trainee trainee = traineeRepository.findById(id).orElse(null);
        if (trainee == null) {
            return ResponseEntity.badRequest().body("Trainee not found");
        }
        trainee.setStatus("REJECTED");
        traineeRepository.save(trainee);
        return ResponseEntity.ok("Trainee rejected");
    }

    @PutMapping("/trainer/approve/{id}")
    public ResponseEntity<String> approveTrainer(@PathVariable String id) {
        Trainer trainer = trainerRepository.findById(id).orElse(null);
        if (trainer == null) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        trainer.setStatus("APPROVED");
        trainerRepository.save(trainer);
        return ResponseEntity.ok("Trainer approved");
    }

    @PutMapping("/trainer/reject/{id}")
    public ResponseEntity<String> rejectTrainer(@PathVariable String id) {
        Trainer trainer = trainerRepository.findById(id).orElse(null);
        if (trainer == null) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        trainer.setStatus("REJECTED");
        trainerRepository.save(trainer);
        return ResponseEntity.ok("Trainer rejected");
    }

    @GetMapping("/trainers/approved")
    public List<Trainer> getApprovedTrainers() {
        return trainerRepository.findByStatus("APPROVED");
    }
}

class TrainerAssignmentRequest {
    private String trainerId;

    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
}
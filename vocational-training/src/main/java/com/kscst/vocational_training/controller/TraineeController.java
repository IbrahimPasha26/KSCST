package com.kscst.vocational_training.controller;

import com.kscst.vocational_training.model.Certificate;
import com.kscst.vocational_training.model.Playlist;
import com.kscst.vocational_training.model.Progress;
import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.TrainingMaterial;
import com.kscst.vocational_training.repository.CertificateRepository;
import com.kscst.vocational_training.repository.PlaylistRepository;
import com.kscst.vocational_training.repository.ProgressRepository;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainingMaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/trainee")
public class TraineeController {

    private static final Logger LOGGER = Logger.getLogger(TraineeController.class.getName());

    private final TraineeRepository traineeRepository;
    private final TrainingMaterialRepository trainingMaterialRepository;
    private final ProgressRepository progressRepository;
    private final PlaylistRepository playlistRepository;
    private final CertificateRepository certificateRepository;

    public TraineeController(
            TraineeRepository traineeRepository,
            TrainingMaterialRepository trainingMaterialRepository,
            ProgressRepository progressRepository,
            PlaylistRepository playlistRepository,
            CertificateRepository certificateRepository) {
        this.traineeRepository = traineeRepository;
        this.trainingMaterialRepository = trainingMaterialRepository;
        this.progressRepository = progressRepository;
        this.playlistRepository = playlistRepository;
        this.certificateRepository = certificateRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<Trainee> getProfile(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching profile for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("Profile fetched for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(trainee);
    }

    @PutMapping("/profile")
    public ResponseEntity<Trainee> updateProfile(@RequestBody Trainee updatedTrainee, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Updating profile for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        trainee.setName(updatedTrainee.getName());
        trainee.setEmail(updatedTrainee.getEmail());
        trainee.setPhone(updatedTrainee.getPhone());
        trainee.setSkill(updatedTrainee.getSkill());
        trainee.setLocation(updatedTrainee.getLocation());
        traineeRepository.save(trainee);
        LOGGER.info("Profile updated for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(trainee);
    }

    @GetMapping("/materials")
    public ResponseEntity<List<TrainingMaterial>> getTrainingMaterials(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching training materials for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null || trainee.getAssignedTrainerId() == null) {
            LOGGER.warning("Trainee not found or no trainer assigned: " + username);
            return ResponseEntity.ok(List.of());
        }
        List<TrainingMaterial> materials = trainingMaterialRepository.findByTrainerId(trainee.getAssignedTrainerId());
        LOGGER.info("Found " + materials.size() + " materials for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(materials);
    }

    @PostMapping("/progress")
    public ResponseEntity<Progress> markMaterialProgress(@RequestBody Progress progressRequest, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Marking material progress for trainee: " + username + ", material ID: " + progressRequest.getMaterialId());
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        TrainingMaterial material = trainingMaterialRepository.findById(progressRequest.getMaterialId()).orElse(null);
        if (material == null || !material.getTrainerId().equals(trainee.getAssignedTrainerId())) {
            LOGGER.warning("Material not found or not assigned to trainee's trainer: " + progressRequest.getMaterialId());
            return ResponseEntity.badRequest().body(null);
        }
        Progress existingProgress = progressRepository.findByTraineeIdAndMaterialId(trainee.getId(), progressRequest.getMaterialId());
        if (existingProgress != null) {
            LOGGER.info("Material already marked as completed: " + progressRequest.getMaterialId());
            return ResponseEntity.ok(existingProgress);
        }
        Progress progress = new Progress();
        progress.setTraineeId(trainee.getId());
        progress.setMaterialId(progressRequest.getMaterialId());
        progress.setCompletedAt(new Date());
        progressRepository.save(progress);
        LOGGER.info("Material progress marked for material ID: " + progressRequest.getMaterialId());
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/progress")
    public ResponseEntity<List<Progress>> getTraineeProgress(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching progress for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        List<Progress> progress = progressRepository.findByTraineeId(trainee.getId());
        LOGGER.info("Found " + progress.size() + " progress entries for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/playlists")
    public ResponseEntity<List<Playlist>> getPlaylists(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching playlists for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null || trainee.getAssignedTrainerId() == null) {
            LOGGER.warning("Trainee not found or no trainer assigned: " + username);
            return ResponseEntity.ok(List.of());
        }
        List<Playlist> playlists = playlistRepository.findByTrainerId(trainee.getAssignedTrainerId());
        LOGGER.info("Found " + playlists.size() + " playlists for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/video-progress")
    public ResponseEntity<Progress> markVideoProgress(@RequestBody Progress progressRequest, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Marking video progress for trainee: " + username + ", playlist ID: " + progressRequest.getPlaylistId() + ", video URL: " + progressRequest.getVideoUrl());
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        Playlist playlist = playlistRepository.findById(progressRequest.getPlaylistId()).orElse(null);
        if (playlist == null || !playlist.getTrainerId().equals(trainee.getAssignedTrainerId())) {
            LOGGER.warning("Playlist not found or not assigned to trainee's trainer: " + progressRequest.getPlaylistId());
            return ResponseEntity.badRequest().body(null);
        }
        boolean videoExists = playlist.getVideos().stream().anyMatch(v -> v.getUrl().equals(progressRequest.getVideoUrl()));
        if (!videoExists) {
            LOGGER.warning("Video URL not found in playlist: " + progressRequest.getVideoUrl());
            return ResponseEntity.badRequest().body(null);
        }
        Progress existingProgress = progressRepository.findByTraineeIdAndPlaylistIdAndVideoUrl(
                trainee.getId(), progressRequest.getPlaylistId(), progressRequest.getVideoUrl()
        );
        if (existingProgress != null) {
            LOGGER.info("Video already marked as completed: " + progressRequest.getVideoUrl());
            return ResponseEntity.ok(existingProgress);
        }
        Progress progress = new Progress();
        progress.setTraineeId(trainee.getId());
        progress.setPlaylistId(progressRequest.getPlaylistId());
        progress.setVideoUrl(progressRequest.getVideoUrl());
        progress.setCompletedAt(new Date());
        progressRepository.save(progress);
        LOGGER.info("Video progress marked for playlist ID: " + progressRequest.getPlaylistId() + ", video URL: " + progressRequest.getVideoUrl());
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/certificate")
    public ResponseEntity<Certificate> getCertificate(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching certificate for trainee: " + username);
        Trainee trainee = traineeRepository.findByUsername(username);
        if (trainee == null) {
            LOGGER.warning("Trainee not found: " + username);
            return ResponseEntity.notFound().build();
        }
        Certificate certificate = certificateRepository.findByTraineeId(trainee.getId());
        if (certificate == null) {
            LOGGER.info("No certificate found for trainee ID: " + trainee.getId());
            return ResponseEntity.notFound().build();
        }
        LOGGER.info("Certificate fetched for trainee ID: " + trainee.getId());
        return ResponseEntity.ok(certificate);
    }
}
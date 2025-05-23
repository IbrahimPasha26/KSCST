package com.kscst.vocational_training.controller;

import com.kscst.vocational_training.model.Playlist;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.TrainingMaterial;
import com.kscst.vocational_training.repository.PlaylistRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainingMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private static final Logger LOGGER = Logger.getLogger(TrainerController.class.getName());

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private TraineeRepository traineeRepository;

    @Autowired
    private TrainingMaterialRepository trainingMaterialRepository;

    @Autowired
    private PlaylistRepository playlistRepository;

    private static final String UPLOAD_DIR = "D:\\KSCST\\vocational-training\\uploads\\";

    @GetMapping("/profile")
    public ResponseEntity<Trainer> getProfile(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching profile for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trainer);
    }

    @PutMapping("/profile")
    public ResponseEntity<Trainer> updateProfile(@RequestBody Trainer updatedTrainer, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Updating profile for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        trainer.setName(updatedTrainer.getName());
        trainer.setEmail(updatedTrainer.getEmail());
        trainer.setPhone(updatedTrainer.getPhone());
        trainer.setExpertise(updatedTrainer.getExpertise());
        trainerRepository.save(trainer);
        LOGGER.info("Profile updated for trainer: " + trainer.getId());
        return ResponseEntity.ok(trainer);
    }

    @GetMapping("/trainees")
    public ResponseEntity<List<Trainee>> getAssignedTrainees(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching assigned trainees for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        List<Trainee> trainees = traineeRepository.findByAssignedTrainerId(trainer.getId());
        return ResponseEntity.ok(trainees);
    }

    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            Authentication authentication) {
        try {
            LOGGER.info("Starting material upload for user: " + authentication.getName());
            if (file.isEmpty()) {
                LOGGER.warning("Upload attempt with empty file");
                return ResponseEntity.badRequest().body("File is empty");
            }

            String username = authentication.getName();
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer == null) {
                LOGGER.warning("Trainer not found: " + username);
                return ResponseEntity.badRequest().body("Trainer not found");
            }

            // Create upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                LOGGER.info("Creating upload directory: " + UPLOAD_DIR);
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    LOGGER.severe("Failed to create upload directory: " + UPLOAD_DIR);
                    return ResponseEntity.badRequest().body("Failed to create upload directory: " + UPLOAD_DIR);
                }
            }

            // Verify directory is writable
            if (!uploadDir.canWrite()) {
                LOGGER.severe("Upload directory is not writable: " + UPLOAD_DIR);
                return ResponseEntity.badRequest().body("Upload directory is not writable: " + UPLOAD_DIR);
            }

            // Generate unique filename
            String fileExtension = file.getOriginalFilename() != null
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
                    : ".unknown";
            String fileName = UUID.randomUUID().toString() + fileExtension;
            String filePath = UPLOAD_DIR + fileName;

            // Save file
            LOGGER.info("Saving file to: " + filePath);
            File destFile = new File(filePath);
            file.transferTo(destFile);
            LOGGER.info("File saved successfully: " + filePath);

            // Save material metadata
            TrainingMaterial material = new TrainingMaterial();
            material.setTrainerId(trainer.getId());
            material.setDescription(description);
            material.setFilePath(filePath);
            material.setFileType(file.getContentType());
            trainingMaterialRepository.save(material);
            LOGGER.info("Material metadata saved for trainer: " + trainer.getId());

            return ResponseEntity.ok(material);
        } catch (Exception e) {
            LOGGER.severe("Error uploading material: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error uploading material: " + e.getMessage());
        }
    }

    @GetMapping("/playlists")
    public ResponseEntity<List<Playlist>> getPlaylists(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching playlists for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        List<Playlist> playlists = playlistRepository.findByTrainerId(trainer.getId());
        LOGGER.info("Found " + playlists.size() + " playlists for trainer: " + trainer.getId());
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/playlists")
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Creating playlist for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        playlist.setTrainerId(trainer.getId());
        playlistRepository.save(playlist);
        LOGGER.info("Playlist created for trainer: " + trainer.getId());
        return ResponseEntity.ok(playlist);
    }

    @PutMapping("/playlists/{id}")
    public ResponseEntity<Playlist> updatePlaylist(@PathVariable String id, @RequestBody Playlist updatedPlaylist, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Updating playlist ID: " + id + " for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        Playlist playlist = playlistRepository.findById(id).orElse(null);
        if (playlist == null || !playlist.getTrainerId().equals(trainer.getId())) {
            LOGGER.warning("Playlist not found or unauthorized: " + id);
            return ResponseEntity.notFound().build();
        }
        playlist.setTitle(updatedPlaylist.getTitle());
        playlist.setDescription(updatedPlaylist.getDescription());
        playlist.setSkill(updatedPlaylist.getSkill());
        playlist.setVideos(updatedPlaylist.getVideos());
        playlistRepository.save(playlist);
        LOGGER.info("Playlist updated: " + id);
        return ResponseEntity.ok(playlist);
    }

    @DeleteMapping("/playlists/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Deleting playlist ID: " + id + " for username: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer == null) {
            LOGGER.warning("Trainer not found: " + username);
            return ResponseEntity.notFound().build();
        }
        Playlist playlist = playlistRepository.findById(id).orElse(null);
        if (playlist == null || !playlist.getTrainerId().equals(trainer.getId())) {
            LOGGER.warning("Playlist not found or unauthorized: " + id);
            return ResponseEntity.notFound().build();
        }
        playlistRepository.deleteById(id);
        LOGGER.info("Playlist deleted: " + id);
        return ResponseEntity.ok().build();
    }
}
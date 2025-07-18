package com.kscst.vocational_training.controller;

import com.kscst.vocational_training.model.Playlist;
import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.model.TrainingMaterial;
import com.kscst.vocational_training.repository.PlaylistRepository;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import com.kscst.vocational_training.repository.TrainingMaterialRepository;
import com.kscst.vocational_training.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private static final Logger LOGGER = Logger.getLogger(TrainerController.class.getName());

    private final TrainerRepository trainerRepository;
    private final TraineeRepository traineeRepository;
    private final TrainingMaterialRepository trainingMaterialRepository;
    private final PlaylistRepository playlistRepository;
    private final ProgressRepository progressRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public TrainerController(
            TrainerRepository trainerRepository,
            TraineeRepository traineeRepository,
            TrainingMaterialRepository trainingMaterialRepository,
            PlaylistRepository playlistRepository,
            ProgressRepository progressRepository) {
        this.trainerRepository = trainerRepository;
        this.traineeRepository = traineeRepository;
        this.trainingMaterialRepository = trainingMaterialRepository;
        this.playlistRepository = playlistRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<Trainer> getProfile(Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            return ResponseEntity.ok(trainer);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<Trainer> updateProfile(@RequestBody Trainer updatedTrainer, Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            trainer.setName(updatedTrainer.getName());
            trainer.setEmail(updatedTrainer.getEmail());
            trainer.setPhone(updatedTrainer.getPhone());
            trainer.setExpertise(updatedTrainer.getExpertise());
            Trainer savedTrainer = trainerRepository.save(trainer);
            return ResponseEntity.ok(savedTrainer);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/trainees")
    public ResponseEntity<List<Trainee>> getAssignedTrainees(Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            List<Trainee> trainees = traineeRepository.findByAssignedTrainerId(trainer.getId());
            return ResponseEntity.ok(trainees);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/materials")
    public ResponseEntity<List<TrainingMaterial>> getMaterials(Authentication authentication) {
        String username = authentication.getName();
        LOGGER.info("Fetching materials for trainer: " + username);
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            List<TrainingMaterial> materials = trainingMaterialRepository.findByTrainerId(trainer.getId());
            LOGGER.info("Found " + materials.size() + " materials for trainer ID: " + trainer.getId());
            return ResponseEntity.ok(materials);
        }
        LOGGER.warning("Trainer not found: " + username);
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/materials")
    public ResponseEntity<TrainingMaterial> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            Authentication authentication) {
        LOGGER.info("Received upload request for file: " + file.getOriginalFilename() + ", title: " + title);
        try {
            if (file.isEmpty()) {
                LOGGER.warning("Upload failed: File is empty");
                return ResponseEntity.badRequest().body(null);
            }
            if (title == null || title.trim().isEmpty()) {
                LOGGER.warning("Upload failed: Title is required");
                return ResponseEntity.badRequest().body(null);
            }

            String username = authentication.getName();
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer == null) {
                LOGGER.warning("Upload failed: Trainer not found for username " + username);
                return ResponseEntity.notFound().build();
            }

            // Validate file type
            String contentType = file.getContentType();
            if (!"application/pdf".equals(contentType) && !"video/mp4".equals(contentType)) {
                LOGGER.warning("Upload failed: Invalid file type " + contentType);
                return ResponseEntity.badRequest().body(null);
            }

            // Save file to uploads directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                LOGGER.info("Created upload directory: " + uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());
            LOGGER.info("File saved to: " + filePath);

            // Save material metadata
            TrainingMaterial material = new TrainingMaterial();
            material.setTrainerId(trainer.getId());
            material.setTitle(title);
            material.setFileName(fileName);
            material.setFilePath(filePath.toString());
            material.setFileType(contentType.equals("application/pdf") ? "PDF" : "Video");
            TrainingMaterial savedMaterial = trainingMaterialRepository.save(material);

            LOGGER.info("Material uploaded successfully: " + savedMaterial.getId());
            return ResponseEntity.ok(savedMaterial);
        } catch (IOException e) {
            LOGGER.severe("Upload failed: IO Exception - " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        } catch (Exception e) {
            LOGGER.severe("Upload failed: Unexpected error - " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/materials/{id}")
    public ResponseEntity<TrainingMaterial> updateMaterial(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        LOGGER.info("Received update request for material ID: " + id + ", title: " + title);
        try {
            if (title == null || title.trim().isEmpty()) {
                LOGGER.warning("Update failed: Title is required");
                return ResponseEntity.badRequest().body(null);
            }

            String username = authentication.getName();
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer == null) {
                LOGGER.warning("Update failed: Trainer not found for username " + username);
                return ResponseEntity.notFound().build();
            }

            Optional<TrainingMaterial> optionalMaterial = trainingMaterialRepository.findById(id);
            if (!optionalMaterial.isPresent() || !optionalMaterial.get().getTrainerId().equals(trainer.getId())) {
                LOGGER.warning("Update failed: Material not found or not owned by trainer");
                return ResponseEntity.notFound().build();
            }

            TrainingMaterial material = optionalMaterial.get();
            material.setTitle(title);

            if (file != null && !file.isEmpty()) {
                // Validate file type
                String contentType = file.getContentType();
                if (!"application/pdf".equals(contentType) && !"video/mp4".equals(contentType)) {
                    LOGGER.warning("Update failed: Invalid file type " + contentType);
                    return ResponseEntity.badRequest().body(null);
                }

                // Delete old file
                Path oldFilePath = Paths.get(material.getFilePath());
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                    LOGGER.info("Deleted old file: " + oldFilePath);
                }

                // Save new file
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                    LOGGER.info("Created upload directory: " + uploadPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path newFilePath = uploadPath.resolve(fileName);
                Files.write(newFilePath, file.getBytes());
                LOGGER.info("New file saved to: " + newFilePath);

                material.setFileName(fileName);
                material.setFilePath(newFilePath.toString());
                material.setFileType(contentType.equals("application/pdf") ? "PDF" : "Video");
            }

            TrainingMaterial updatedMaterial = trainingMaterialRepository.save(material);
            LOGGER.info("Material updated successfully: " + updatedMaterial.getId());
            return ResponseEntity.ok(updatedMaterial);
        } catch (IOException e) {
            LOGGER.severe("Update failed: IO Exception - " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        } catch (Exception e) {
            LOGGER.severe("Update failed: Unexpected error - " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable String id, Authentication authentication) {
        LOGGER.info("Received delete request for material ID: " + id);
        try {
            String username = authentication.getName();
            Trainer trainer = trainerRepository.findByUsername(username);
            if (trainer == null) {
                LOGGER.warning("Delete failed: Trainer not found for username " + username);
                return ResponseEntity.notFound().build();
            }

            Optional<TrainingMaterial> optionalMaterial = trainingMaterialRepository.findById(id);
            if (!optionalMaterial.isPresent() || !optionalMaterial.get().getTrainerId().equals(trainer.getId())) {
                LOGGER.warning("Delete failed: Material not found or not owned by trainer");
                return ResponseEntity.notFound().build();
            }

            TrainingMaterial material = optionalMaterial.get();
            // Delete file
            Path filePath = Paths.get(material.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                LOGGER.info("Deleted file: " + filePath);
            }

            // Delete progress records
            progressRepository.deleteByMaterialId(id);
            LOGGER.info("Deleted progress records for material ID: " + id);

            // Delete material
            trainingMaterialRepository.deleteById(id);
            LOGGER.info("Material deleted successfully: " + id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            LOGGER.severe("Delete failed: IO Exception - " + e.getMessage());
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            LOGGER.severe("Delete failed: Unexpected error - " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/playlists")
    public ResponseEntity<List<Playlist>> getPlaylists(Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            List<Playlist> playlists = playlistRepository.findByTrainerId(trainer.getId());
            return ResponseEntity.ok(playlists);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/playlists")
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist, Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            playlist.setTrainerId(trainer.getId());
            Playlist savedPlaylist = playlistRepository.save(playlist);
            return ResponseEntity.ok(savedPlaylist);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/playlists/{id}")
    public ResponseEntity<Playlist> updatePlaylist(@PathVariable String id, @RequestBody Playlist updatedPlaylist, Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            Optional<Playlist> existingPlaylist = playlistRepository.findById(id);
            if (existingPlaylist.isPresent()) {
                Playlist playlist = existingPlaylist.get();
                if (playlist.getTrainerId().equals(trainer.getId())) {
                    playlist.setTitle(updatedPlaylist.getTitle());
                    playlist.setSkill(updatedPlaylist.getSkill());
                    playlist.setVideos(updatedPlaylist.getVideos());
                    Playlist savedPlaylist = playlistRepository.save(playlist);
                    return ResponseEntity.ok(savedPlaylist);
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/playlists/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        Trainer trainer = trainerRepository.findByUsername(username);
        if (trainer != null) {
            Optional<Playlist> playlist = playlistRepository.findById(id);
            if (playlist.isPresent() && playlist.get().getTrainerId().equals(trainer.getId())) {
                playlistRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
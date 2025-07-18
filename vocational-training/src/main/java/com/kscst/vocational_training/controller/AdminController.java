package com.kscst.vocational_training.controller;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.kscst.vocational_training.model.Certificate;
import com.kscst.vocational_training.model.Playlist;
import com.kscst.vocational_training.model.Progress;
import com.kscst.vocational_training.model.Trainee;
import com.kscst.vocational_training.model.Trainer;
import com.kscst.vocational_training.model.TrainingMaterial;
import com.kscst.vocational_training.repository.CertificateRepository;
import com.kscst.vocational_training.repository.PlaylistRepository;
import com.kscst.vocational_training.repository.ProgressRepository;
import com.kscst.vocational_training.repository.TraineeRepository;
import com.kscst.vocational_training.repository.TrainingMaterialRepository;
import com.kscst.vocational_training.repository.TrainerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final TraineeRepository traineeRepository;
    private final TrainerRepository trainerRepository;
    private final ProgressRepository progressRepository;
    private final TrainingMaterialRepository trainingMaterialRepository;
    private final PlaylistRepository playlistRepository;
    private final CertificateRepository certificateRepository;

    public AdminController(
            TraineeRepository traineeRepository,
            TrainerRepository trainerRepository,
            ProgressRepository progressRepository,
            TrainingMaterialRepository trainingMaterialRepository,
            PlaylistRepository playlistRepository,
            CertificateRepository certificateRepository) {
        this.traineeRepository = traineeRepository;
        this.trainerRepository = trainerRepository;
        this.progressRepository = progressRepository;
        this.trainingMaterialRepository = trainingMaterialRepository;
        this.playlistRepository = playlistRepository;
        this.certificateRepository = certificateRepository;
    }

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
        Optional<Trainee> traineeOpt = traineeRepository.findById(id);
        if (!traineeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Trainee not found");
        }
        if (!trainerRepository.existsById(request.getTrainerId())) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        Trainee trainee = traineeOpt.get();
        trainee.setStatus("APPROVED");
        trainee.setAssignedTrainerId(request.getTrainerId());
        traineeRepository.save(trainee);
        return ResponseEntity.ok("Trainee approved and assigned to trainer");
    }

    @PutMapping("/trainee/reject/{id}")
    public ResponseEntity<String> rejectTrainee(@PathVariable String id) {
        Optional<Trainee> traineeOpt = traineeRepository.findById(id);
        if (!traineeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Trainee not found");
        }
        Trainee trainee = traineeOpt.get();
        trainee.setStatus("REJECTED");
        traineeRepository.save(trainee);
        return ResponseEntity.ok("Trainee rejected");
    }

    @PutMapping("/trainer/approve/{id}")
    public ResponseEntity<String> approveTrainer(@PathVariable String id) {
        Optional<Trainer> trainerOpt = trainerRepository.findById(id);
        if (!trainerOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        Trainer trainer = trainerOpt.get();
        trainer.setStatus("APPROVED");
        trainerRepository.save(trainer);
        return ResponseEntity.ok("Trainer approved");
    }

    @PutMapping("/trainer/reject/{id}")
    public ResponseEntity<String> rejectTrainer(@PathVariable String id) {
        Optional<Trainer> trainerOpt = trainerRepository.findById(id);
        if (!trainerOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Trainer not found");
        }
        Trainer trainer = trainerOpt.get();
        trainer.setStatus("REJECTED");
        trainerRepository.save(trainer);
        return ResponseEntity.ok("Trainer rejected");
    }

    @GetMapping("/trainers/approved")
    public List<Trainer> getApprovedTrainers() {
        return trainerRepository.findByStatus("APPROVED");
    }

    @GetMapping("/progress")
    public List<TraineeProgressResponse> getAllTraineeProgress() {
        List<Trainee> trainees = traineeRepository.findAll();
        List<TraineeProgressResponse> response = new ArrayList<>();

        for (Trainee trainee : trainees) {
            if (!trainee.getStatus().equals("APPROVED")) continue;

            List<Progress> progressList = progressRepository.findByTraineeId(trainee.getId());
            List<TrainingMaterial> materials = trainingMaterialRepository.findByTrainerId(trainee.getAssignedTrainerId());
            List<Playlist> playlists = playlistRepository.findByTrainerId(trainee.getAssignedTrainerId());
            Certificate certificate = certificateRepository.findByTraineeId(trainee.getId());

            int totalVideos = playlists.stream()
                    .mapToInt(p -> p.getVideos() != null ? p.getVideos().size() : 0)
                    .sum();
            int totalItems = materials.size() + totalVideos;

            List<ProgressItem> progressItems = progressList.stream().map(progress -> {
                ProgressItem item = new ProgressItem();
                item.setCompletedAt(progress.getCompletedAt());

                if (progress.getMaterialId() != null) {
                    trainingMaterialRepository.findById(progress.getMaterialId()).ifPresent(material -> {
                        item.setType("Material");
                        item.setTitle(material.getTitle());
                        item.setFileType(material.getFileType());
                    });
                } else if (progress.getPlaylistId() != null && progress.getVideoUrl() != null) {
                    playlistRepository.findById(progress.getPlaylistId()).ifPresent(playlist -> {
                        item.setType("Video");
                        item.setPlaylistTitle(playlist.getTitle());
                        Optional<Playlist.Video> video = playlist.getVideos().stream()
                                .filter(v -> v.getUrl().equals(progress.getVideoUrl()))
                                .findFirst();
                        video.ifPresent(v -> item.setTitle(v.getName()));
                    });
                }
                return item;
            }).filter(item -> item.getTitle() != null).collect(Collectors.toList());

            TraineeProgressResponse traineeProgress = new TraineeProgressResponse();
            traineeProgress.setTraineeId(trainee.getId());
            traineeProgress.setUsername(trainee.getUsername());
            traineeProgress.setName(trainee.getName());
            traineeProgress.setSkill(trainee.getSkill());
            traineeProgress.setProgressItems(progressItems);
            traineeProgress.setCompletedItems(progressItems.size());
            traineeProgress.setTotalItems(totalItems);
            traineeProgress.setCompletionPercentage(totalItems > 0 ? (double) progressItems.size() / totalItems * 100 : 0);
            traineeProgress.setHasCertificate(certificate != null);
            response.add(traineeProgress);
        }

        return response;
    }

    @PostMapping("/certificate/{traineeId}")
    public ResponseEntity<String> deployCertificate(@PathVariable String traineeId) {
        Optional<Trainee> traineeOpt = traineeRepository.findById(traineeId);
        if (!traineeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Trainee not found");
        }
        Trainee trainee = traineeOpt.get();
        if (!trainee.getStatus().equals("APPROVED")) {
            return ResponseEntity.badRequest().body("Trainee is not approved");
        }

        Certificate existingCertificate = certificateRepository.findByTraineeId(traineeId);
        if (existingCertificate != null) {
            return ResponseEntity.badRequest().body("Certificate already deployed for this trainee");
        }

        List<Progress> progressList = progressRepository.findByTraineeId(traineeId);
        List<TrainingMaterial> materials = trainingMaterialRepository.findByTrainerId(trainee.getAssignedTrainerId());
        List<Playlist> playlists = playlistRepository.findByTrainerId(trainee.getAssignedTrainerId());
        int totalVideos = playlists.stream()
                .mapToInt(p -> p.getVideos() != null ? p.getVideos().size() : 0)
                .sum();
        int totalItems = materials.size() + totalVideos;
        double completionPercentage = totalItems > 0 ? (double) progressList.size() / totalItems * 100 : 0;

        if (Math.abs(completionPercentage - 100.0) > 0.01) {
            return ResponseEntity.badRequest().body("Trainee has not completed all training items");
        }

        try {
            String fileName = "certificate_" + traineeId + "_" + System.currentTimeMillis() + ".pdf";
            String filePath = "uploads/certificates/" + fileName;
            File directory = new File("uploads/certificates");
            if (!directory.exists()) {
                directory.mkdirs();
            }

            PdfWriter writer = new PdfWriter(filePath);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Certificate of Completion")
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            document.add(new Paragraph("This certifies that")
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(new Text(trainee.getName())
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(20)
                    .setBold())
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10));

            document.add(new Paragraph("has successfully completed the training program in")
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(new Text(trainee.getSkill())
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(18)
                    .setBold())
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            document.add(new Paragraph("Issued on: " + new Date().toString())
                    .setFont(PdfFontFactory.createFont())
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.BLUE));

            document.close();

            Certificate certificate = new Certificate();
            certificate.setTraineeId(traineeId);
            certificate.setFilePath(fileName);
            certificate.setIssuedAt(new Date());
            certificateRepository.save(certificate);

            return ResponseEntity.ok("Certificate deployed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to generate certificate: " + e.getMessage());
        }
    }
}

class TrainerAssignmentRequest {
    private String trainerId;

    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
}

class TraineeProgressResponse {
    private String traineeId;
    private String username;
    private String name;
    private String skill;
    private List<ProgressItem> progressItems;
    private int completedItems;
    private int totalItems;
    private double completionPercentage;
    private boolean hasCertificate;

    public String getTraineeId() { return traineeId; }
    public void setTraineeId(String traineeId) { this.traineeId = traineeId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    public List<ProgressItem> getProgressItems() { return progressItems; }
    public void setProgressItems(List<ProgressItem> progressItems) { this.progressItems = progressItems; }
    public int getCompletedItems() { return completedItems; }
    public void setCompletedItems(int completedItems) { this.completedItems = completedItems; }
    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }
    public boolean isHasCertificate() { return hasCertificate; }
    public void setHasCertificate(boolean hasCertificate) { this.hasCertificate = hasCertificate; }
}

class ProgressItem {
    private String type;
    private String title;
    private String fileType;
    private String playlistTitle;
    private Date completedAt;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getPlaylistTitle() { return playlistTitle; }
    public void setPlaylistTitle(String playlistTitle) { this.playlistTitle = playlistTitle; }
    public Date getCompletedAt() { return completedAt; }
    public void setCompletedAt(Date completedAt) { this.completedAt = completedAt; }
}
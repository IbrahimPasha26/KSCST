package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByTraineeId(String traineeId);
    Progress findByTraineeIdAndMaterialId(String traineeId, String materialId);
    Progress findByTraineeIdAndPlaylistIdAndVideoUrl(String traineeId, String playlistId, String videoUrl);
    void deleteByMaterialId(String materialId);
}
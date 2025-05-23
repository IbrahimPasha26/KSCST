package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.TrainingMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TrainingMaterialRepository extends MongoRepository<TrainingMaterial, String> {
    List<TrainingMaterial> findByTrainerId(String trainerId);
}
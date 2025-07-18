package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.Trainer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TrainerRepository extends MongoRepository<Trainer, String> {
    Trainer findByUsername(String username);
    List<Trainer> findByStatus(String status);
    List<Trainer> findBySkillAndStatus(String skill, String status);
}
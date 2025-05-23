package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.Trainee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TraineeRepository extends MongoRepository<Trainee, String> {
    Trainee findByUsername(String username);
    List<Trainee> findByAssignedTrainerId(String trainerId);
}
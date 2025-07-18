package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CertificateRepository extends MongoRepository<Certificate, String> {
    Certificate findByTraineeId(String traineeId);
}
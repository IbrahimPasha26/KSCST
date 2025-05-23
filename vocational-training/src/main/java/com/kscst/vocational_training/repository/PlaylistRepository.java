package com.kscst.vocational_training.repository;

import com.kscst.vocational_training.model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PlaylistRepository extends MongoRepository<Playlist, String> {
    List<Playlist> findByTrainerId(String trainerId);
}
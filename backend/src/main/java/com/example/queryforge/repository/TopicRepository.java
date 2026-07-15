package com.example.queryforge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.queryforge.model.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByLanguageOrderByLevelAscOrderIndexAsc(Topic.Language language);
    Optional<Topic> findBySlug(String slug);
}
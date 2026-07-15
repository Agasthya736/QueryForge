package com.example.queryforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.queryforge.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByTopicIdOrderByOrderIndexAsc(Long topicId);
}
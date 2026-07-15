package com.example.queryforge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.queryforge.model.Lesson;
import com.example.queryforge.model.Topic;
import com.example.queryforge.repository.LessonRepository;
import com.example.queryforge.repository.TopicRepository;

@RestController
@RequestMapping("/api/curriculum")
public class CurriculumController {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    public CurriculumController(TopicRepository topicRepository, LessonRepository lessonRepository) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
    }

    @GetMapping("/topics")
    public List<Topic> getTopics(@RequestParam(defaultValue = "SQL") Topic.Language language) {
        return topicRepository.findByLanguageOrderByLevelAscOrderIndexAsc(language);
    }

    @GetMapping("/topics/{slug}")
    public ResponseEntity<?> getTopicWithLessons(@PathVariable String slug) {
        var topicOpt = topicRepository.findBySlug(slug);
        if (topicOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Topic topic = topicOpt.get();
        List<Lesson> lessons = lessonRepository.findByTopicIdOrderByOrderIndexAsc(topic.getId());
        return ResponseEntity.ok(Map.of("topic", topic, "lessons", lessons));
    }
}
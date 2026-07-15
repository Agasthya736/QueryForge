package com.example.queryforge.config;

import java.io.InputStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.example.queryforge.model.Lesson;
import com.example.queryforge.model.Topic;
import com.example.queryforge.repository.LessonRepository;
import com.example.queryforge.repository.TopicRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CurriculumSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CurriculumSeeder(TopicRepository topicRepository, LessonRepository lessonRepository) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (topicRepository.count() > 0) return; // don't reseed if already populated

        loadLevel("curriculum/beginner.json", Topic.Level.BEGINNER);
        loadLevel("curriculum/intermediate.json", Topic.Level.INTERMEDIATE);
        loadLevel("curriculum/advanced.json", Topic.Level.ADVANCED);
    }

    private void loadLevel(String resourcePath, Topic.Level level) throws Exception {
        try (InputStream is = new ClassPathResource(resourcePath).getInputStream()) {
            JsonNode topics = objectMapper.readTree(is);
            for (JsonNode topicNode : topics) {
                Topic topic = new Topic();
                topic.setSlug(topicNode.get("slug").asText());
                topic.setTitle(topicNode.get("title").asText());
                topic.setDescription(topicNode.get("description").asText());
                topic.setLevel(level);
                topic.setOrderIndex(topicNode.get("orderIndex").asInt());
                topic.setLanguage(Topic.Language.SQL);
                topic = topicRepository.save(topic);

                for (JsonNode lessonNode : topicNode.get("lessons")) {
                    Lesson lesson = new Lesson();
                    lesson.setTopic(topic);
                    lesson.setTitle(lessonNode.get("title").asText());
                    lesson.setContentMarkdown(lessonNode.get("content").asText());
                    lesson.setOrderIndex(lessonNode.get("orderIndex").asInt());
                    lessonRepository.save(lesson);
                }
            }
        }
    }
}
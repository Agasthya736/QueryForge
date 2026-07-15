package com.example.queryforge.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug; // e.g. "select-basics"

    @Column(nullable = false)
    private String title; // e.g. "SELECT Basics"

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Level level;

    @Column(nullable = false)
    private Integer orderIndex; // controls display order within a level

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language = Language.SQL;

    public enum Level { BEGINNER, INTERMEDIATE, ADVANCED }
    public enum Language { SQL, MONGODB }

    // Getters and setters
    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Level getLevel() { return level; }
    public void setLevel(Level level) { this.level = level; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }
}
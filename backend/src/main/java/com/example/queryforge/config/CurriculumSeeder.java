package com.example.queryforge.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.queryforge.model.Lesson;
import com.example.queryforge.model.Topic;
import com.example.queryforge.repository.LessonRepository;
import com.example.queryforge.repository.TopicRepository;

@Component
public class CurriculumSeeder implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;

    public CurriculumSeeder(TopicRepository topicRepository, LessonRepository lessonRepository) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public void run(String... args) {
        if (topicRepository.count() > 0) return; // don't reseed if already populated

        addTopic("select-basics", "SELECT Basics", "Learn how to retrieve data from a table.",
                Topic.Level.BEGINNER, 1,
                "Introduction to SELECT",
                "The `SELECT` statement retrieves rows from a table.\n\n" +
                "```sql\nSELECT column1, column2 FROM table_name;\n```\n\n" +
                "Use `SELECT *` to retrieve all columns, though it's best practice to name columns explicitly in real applications.");

        addTopic("where-filtering", "Filtering with WHERE", "Narrow down results using conditions.",
                Topic.Level.BEGINNER, 2,
                "The WHERE clause",
                "`WHERE` filters rows based on a condition.\n\n" +
                "```sql\nSELECT * FROM employees WHERE salary > 50000;\n```\n\n" +
                "Combine conditions with `AND`, `OR`, and use `IN`, `BETWEEN`, `LIKE` for common patterns.");

        addTopic("joins", "JOINs", "Combine rows from two or more tables.",
                Topic.Level.INTERMEDIATE, 1,
                "INNER JOIN",
                "An `INNER JOIN` returns rows that have matching values in both tables.\n\n" +
                "```sql\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;\n```");

        addTopic("group-by-aggregates", "GROUP BY & Aggregates", "Summarize data with COUNT, SUM, AVG, and GROUP BY.",
                Topic.Level.INTERMEDIATE, 2,
                "Aggregate functions",
                "Aggregate functions like `COUNT`, `SUM`, `AVG` operate over groups of rows.\n\n" +
                "```sql\nSELECT department, COUNT(*) FROM employees GROUP BY department;\n```\n\n" +
                "Use `HAVING` to filter on aggregated values (not `WHERE`, which filters before aggregation).");

        addTopic("window-functions", "Window Functions", "Rank, compare, and calculate running values across rows.",
                Topic.Level.ADVANCED, 1,
                "ROW_NUMBER and RANK",
                "Window functions compute values across a set of rows related to the current row, without collapsing them like GROUP BY.\n\n" +
                "```sql\nSELECT name, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank\nFROM employees;\n```");

        addTopic("ctes-recursive", "CTEs & Recursive Queries", "Structure complex queries with WITH clauses.",
                Topic.Level.ADVANCED, 2,
                "Common Table Expressions",
                "A CTE lets you define a named temporary result set.\n\n" +
                "```sql\nWITH high_earners AS (\n  SELECT * FROM employees WHERE salary > 100000\n)\nSELECT * FROM high_earners WHERE department = 'Engineering';\n```\n\n" +
                "Recursive CTEs (`WITH RECURSIVE`) are used for hierarchical data like org charts.");
    }

    private void addTopic(String slug, String title, String description, Topic.Level level,
                           int order, String lessonTitle, String lessonContent) {
        Topic topic = new Topic();
        topic.setSlug(slug);
        topic.setTitle(title);
        topic.setDescription(description);
        topic.setLevel(level);
        topic.setOrderIndex(order);
        topic.setLanguage(Topic.Language.SQL);
        topic = topicRepository.save(topic);

        Lesson lesson = new Lesson();
        lesson.setTopic(topic);
        lesson.setTitle(lessonTitle);
        lesson.setContentMarkdown(lessonContent);
        lesson.setOrderIndex(1);
        lessonRepository.save(lesson);
    }
}
package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Course;
import com.benedict.duomonggo.model.Difficulty;
import com.benedict.duomonggo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional
    public Course createCourse(String title, String description, Difficulty difficulty, Integer expReward) {
        Course course = new Course(title, description, difficulty, expReward);
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, String title, String description, Difficulty difficulty, Integer expReward) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setTitle(title);
            course.setDescription(description);
            course.setDifficulty(difficulty);
            course.setExpReward(expReward);
            return courseRepository.save(course);
        }
        return null;
    }

    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public List<Course> getCoursesByDifficulty(Difficulty difficulty) {
        return courseRepository.findByDifficulty(difficulty);
    }
}

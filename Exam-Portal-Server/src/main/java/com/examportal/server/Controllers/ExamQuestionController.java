package com.examportal.server.Controllers;

import com.examportal.server.Entity.ExamQuestion;
import com.examportal.server.Service.ExamQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-questions")
public class ExamQuestionController {

    @Autowired
    private ExamQuestionService examQuestionService;

    @GetMapping
    public ResponseEntity<List<ExamQuestion>> getAllExamQuestions() {
        List<ExamQuestion> examQuestions = examQuestionService.getList();
        return ResponseEntity.ok(examQuestions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamQuestion> getExamQuestionById(@PathVariable Long id) {
        ExamQuestion examQuestion = examQuestionService.getExamQuestionById(id);
        if (examQuestion != null) {
            return ResponseEntity.ok(examQuestion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ExamQuestion> createExamQuestion(@RequestBody ExamQuestion examQuestion) {
        examQuestionService.save(examQuestion);
        return ResponseEntity.status(201).body(examQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamQuestion> updateExamQuestion(@PathVariable Long id, @RequestBody ExamQuestion examQuestion) {
        ExamQuestion existingExamQuestion = examQuestionService.getExamQuestionById(id);
        if (existingExamQuestion != null) {
            examQuestion.setId(id);
            examQuestionService.save(examQuestion);
            return ResponseEntity.ok(examQuestion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamQuestion(@PathVariable Long id, @RequestBody ExamQuestion examQuestion) {
        ExamQuestion existingExamQuestion = examQuestionService.getExamQuestionById(id);
        if (existingExamQuestion != null) {
            examQuestionService.delete(examQuestion);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

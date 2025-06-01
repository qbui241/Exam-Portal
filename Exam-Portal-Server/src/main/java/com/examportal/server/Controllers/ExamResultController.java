package com.examportal.server.Controllers;

import com.examportal.server.Entity.ExamResult;
import com.examportal.server.Service.ExamResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-results")
public class ExamResultController {

    @Autowired
    private ExamResultService examResultService;

    @GetMapping
    public ResponseEntity<List<ExamResult>> getAllExamResults() {
        List<ExamResult> examResults = examResultService.getList();
        return ResponseEntity.ok(examResults);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResult> getExamResultById(@PathVariable Long id) {
        ExamResult examResult = examResultService.getExamResultById(id);
        if (examResult != null) {
            return ResponseEntity.ok(examResult);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ExamResult> createExamResult(@RequestBody ExamResult examResult) {
        examResultService.save(examResult);
        return ResponseEntity.status(201).body(examResult);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamResult> updateExamResult(@PathVariable Long id, @RequestBody ExamResult examResult) {
        ExamResult existingExamResult = examResultService.getExamResultById(id);
        if (existingExamResult != null) {
            examResult.setId(id);
            examResultService.save(examResult);
            return ResponseEntity.ok(examResult);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamResult(@PathVariable Long id) {
        ExamResult existingExamResult = examResultService.getExamResultById(id);
        if (existingExamResult != null) {
            examResultService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

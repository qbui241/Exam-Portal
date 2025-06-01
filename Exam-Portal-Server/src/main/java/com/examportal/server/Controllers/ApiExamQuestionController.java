package com.examportal.server.Controllers;


import com.examportal.server.Service.ExamQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/exam/question")
public class ApiExamQuestionController {

    @Autowired
    private ExamQuestionService examQuestionService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateExamQuestions(@RequestParam Long examId, @RequestParam("questionsPerExam") int questionsPerExam) {
        // Generate a set of questions for the exam
        examQuestionService.generateExamQuestions(examId, questionsPerExam);
        return ResponseEntity.ok("Generated  questions for id " + examId + " successfully");
    }

    @GetMapping("get/question/by/examId/{examId}")
    public ResponseEntity<?> getExamQuestionsByExamIdRandOrder(@PathVariable Long examId) {
        Map<String, Object> response = new HashMap<>();
        response.put("examId", examId);
        response.put("questions", examQuestionService.getExamQuestionsByExamIdRandOrder(examId));
        return ResponseEntity.ok(response);
    }

    @GetMapping("get/question/by/examId/{examId}/default")
    public ResponseEntity<?> getExamQuestionsByExamId(@PathVariable Long examId) {
        Map<String, Object> response = new HashMap<>();
        response.put("examId", examId);
        response.put("questions", examQuestionService.getExamQuestionsByExamId(examId));
        return ResponseEntity.ok(response);
    }
}

package com.examportal.server.Controllers;

import com.examportal.server.DTO.ResponseDTO;
import com.examportal.server.Entity.Exam;
import com.examportal.server.Entity.Question;
import com.examportal.server.Service.ExamQuestionService;
import com.examportal.server.Service.ExamService;
import com.examportal.server.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
public class ApiQuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ExamQuestionService examQuestionService;

    @Autowired
    private ExamService examService;

    @PostMapping("/add/question")
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        try {
            questionService.save(question);
            long examSessionId = question.getExamSessionId();

            // Check if any exams exist for this session
            List<Exam> examExists = examService.getExamBySessionId(examSessionId);

            boolean autoGenerateExamsExist = examExists.stream()
                    .anyMatch(exam -> "auto-generate".equals(exam.getType()));

            if (autoGenerateExamsExist) {
                // Regenerate exam questions if auto-generate exams exist
                examQuestionService.regenerateExamQuestions(examSessionId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", question.getId());
            response.put("message", "Question added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Failed to add question: " + e.getMessage()));
        }
    }

    @PutMapping("/update/question/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable("id") Long id, @RequestBody Question question) {
        try {
            // Ensure the path ID matches the question object ID
            question.setId(id);

            Question updatedQuestion = questionService.update(question);
            if (updatedQuestion == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("Question not found with ID: " + id));
            }
            long examSessionId = updatedQuestion.getExamSessionId();
            // Check if any exams exist for this session
            List<Exam> examExists = examService.getExamBySessionId(examSessionId);

            boolean autoGenerateExamsExist = examExists.stream()
                    .anyMatch(exam -> "auto-generate".equals(exam.getType()));

            if (autoGenerateExamsExist) {
                // Regenerate exam questions if auto-generate exams exist
                examQuestionService.regenerateExamQuestions(examSessionId);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("question", updatedQuestion);
            response.put("message", "Question updated successfully");

            return ResponseEntity.ok(response);


        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Failed to update question: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable("id") Long id) {
        try {
            // Get the question first to retrieve examSessionId
            Question question = questionService.getQuestionById(id);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("Question not found with ID: " + id));
            }

            // Store the examSessionId before deletion
            long examSessionId = question.getExamSessionId();

            // Now delete the question
            boolean deleted = questionService.delete(id);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("Failed to delete question with ID: " + id));
            }

            // Use the previously stored examSessionId
            // Check if any exams exist for this session
            List<Exam> examExists = examService.getExamBySessionId(examSessionId);

            boolean autoGenerateExamsExist = examExists.stream()
                    .anyMatch(exam -> "auto-generate".equals(exam.getType()));

            if (autoGenerateExamsExist) {
                // Regenerate exam questions if auto-generate exams exist
                examQuestionService.regenerateExamQuestions(examSessionId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Question deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Failed to delete question: " + e.getMessage()));
        }
    }

    @GetMapping("/get/question/by/exam/session/id/{id}")
    public ResponseEntity<?> getQuestionBySessionId(@PathVariable("id") Long id) {
        try {
            List<Question> questions = questionService.getQuestionsByExamSessionId(id);
            if (questions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("No questions found for the given exam session ID"));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("questions", questions);
            response.put("message", "Questions retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Failed to get question: " + e.getMessage()));
        }
    }

    @GetMapping("/get/question/by/id/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable("id") Long id) {
        try {
            Question question = questionService.getQuestionById(id);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("Question not found with ID: " + id));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("question", question);
            response.put("message", "Question retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Failed to get question: " + e.getMessage()));
        }
    }
}

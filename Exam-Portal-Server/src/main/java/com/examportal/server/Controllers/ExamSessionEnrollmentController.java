package com.examportal.server.Controllers;

import com.examportal.server.Entity.ExamSessionEnrollment;
import com.examportal.server.Service.ExamSessionEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-session-enrollment")
public class ExamSessionEnrollmentController {

    @Autowired
    private ExamSessionEnrollmentService examSessionEnrollmentService;

    @GetMapping("/list")
    public ResponseEntity<List<ExamSessionEnrollment>> getList() {
        List<ExamSessionEnrollment> list = examSessionEnrollmentService.getList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamSessionEnrollment> getExamSessionEnrollment(@PathVariable Long id) {
        ExamSessionEnrollment enrollment = examSessionEnrollmentService.getExamSessionEnrollment(id);
        return ResponseEntity.ok(enrollment);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody ExamSessionEnrollment enrollment) {
        examSessionEnrollmentService.save(enrollment);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examSessionEnrollmentService.delete(id);
        return ResponseEntity.ok().build();
    }

}

package com.examportal.server.Controllers;

import com.examportal.server.Entity.QuestionAnswer;
import com.examportal.server.Service.QuestionAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-answer")
public class QuestionAnswerController {

    @Autowired
    private QuestionAnswerService questionAnswerService;

    @GetMapping("/list")
    public ResponseEntity<List<QuestionAnswer>> getList() {
        List<QuestionAnswer> list = questionAnswerService.getList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionAnswer> getQuestionAnswer(@PathVariable Long id) {
        QuestionAnswer questionAnswer = questionAnswerService.getAnswerById(id);
        return ResponseEntity.ok(questionAnswer);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> save(@RequestBody QuestionAnswer questionAnswer) {
        questionAnswerService.save(questionAnswer);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionAnswerService.delete(id);
        return ResponseEntity.ok().build();
    }
}

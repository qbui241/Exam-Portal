package com.examportal.server.Controllers;

import com.examportal.server.Configs.JwtTokenUtil;
import com.examportal.server.DTO.StudentAnswerAutoGen;
import com.examportal.server.DTO.UploadStudentAnswerRequest;
import com.examportal.server.Entity.StudentAnswer;
import com.examportal.server.Entity.User;
import com.examportal.server.Service.StudentAnswerService;
import com.examportal.server.Service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/student-answer")
public class ApiStudentAnswerController {

    @Autowired
    private StudentAnswerService studentAnswerService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserService userService;

    @PostMapping("/upload/save")
    public ResponseEntity<?> saveStudentAnswers(@RequestBody UploadStudentAnswerRequest request) {
        try {
            String token = jwtTokenUtil.resolveToken(this.request);
            if (token == null || !jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ hoặc thiếu");
            }
            Long userId = jwtTokenUtil.getIdFromToken(token);

            // Lưu câu trả lời của sinh viên
            studentAnswerService.saveUploadStudentAnswers(request, userId);

            return ResponseEntity.ok(Collections.singletonMap("message", "Lưu câu trả lời thành công"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @GetMapping("/get/list/student-answer/auto-generate/{examId}")
    public ResponseEntity<?> getListStudentAnswerAutoGenerate(@PathVariable("examId") Long examId, HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");

            if (jwt == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }
            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }
            String username = claims.getSubject();

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            List<StudentAnswerAutoGen> studentAnswerAutoGenList = new ArrayList<>();
            List<StudentAnswer> studentAnswerList = studentAnswerService.getStudentAnswers(examId, user.getId());
            for (StudentAnswer studentAnswer : studentAnswerList) {
                StudentAnswerAutoGen studentAnswerAutoGen = new StudentAnswerAutoGen();
                studentAnswerAutoGen.setQuestion_id(studentAnswer.getQuestionId());
                studentAnswerAutoGen.setSelected_answer_id(studentAnswer.getAnswerId());
                studentAnswerAutoGenList.add(studentAnswerAutoGen);
            }
            return ResponseEntity.ok(studentAnswerAutoGenList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }
}

package com.examportal.server.Controllers;


import com.examportal.server.Configs.JwtTokenUtil;
import com.examportal.server.Entity.ExamSession;
import com.examportal.server.Request.StudentInExamSessionEnrollmentRequest;
import com.examportal.server.Service.ExamSessionEnrollmentService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("api/exam-session-enrollment")
public class ApiExamSessionEnrollmentController {
    @Autowired
    private ExamSessionEnrollmentService examSessionEnrollmentService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private HttpServletRequest request;



    @GetMapping("/get/list/student/in/sessionId/{examSessionId}")
    public ResponseEntity<?> getListStudentsInSession(@PathVariable("examSessionId") Long examSessionId) {
        try {
            List<StudentInExamSessionEnrollmentRequest> studentList = examSessionEnrollmentService.getInfoStudentInExamSessionEnrollment(examSessionId);
            return ResponseEntity.ok(studentList);
        } catch (Exception e) {
            // Log lỗi nếu cần
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PostMapping("/join/exam-session/{examCode}")
    public ResponseEntity<?> joinExamSessionEnrollment(@PathVariable("examCode") String examCode) {
        try {
            String token = jwtTokenUtil.resolveToken(request);
            if (token == null || !jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ hoặc thiếu");
            }
            Long userId = jwtTokenUtil.getIdFromToken(token);

            examSessionEnrollmentService.joinExamSessionEnrollment(examCode, userId);

            return ResponseEntity.ok(Collections.singletonMap("message", "Tham gia kỳ thi thành công"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Có lỗi xảy ra: " + e.getMessage()));
        }
    }


    @GetMapping("/get/exam-session-by-studentId")
    public ResponseEntity<?> getExamSessionByStudentId() {
        try {
            String token = jwtTokenUtil.resolveToken(request);
            if (token == null || !jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ hoặc thiếu");
            }

            Long studentId = jwtTokenUtil.getIdFromToken(token);
            List<ExamSession> examSessionList = examSessionEnrollmentService.getExamSessionByStudentId(studentId);
            return ResponseEntity.ok(examSessionList);
        } catch (Exception e) {
            // Log lỗi nếu cần
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

}


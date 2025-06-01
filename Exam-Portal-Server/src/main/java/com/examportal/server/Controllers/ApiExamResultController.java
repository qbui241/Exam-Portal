package com.examportal.server.Controllers;

import com.examportal.server.Configs.JwtTokenUtil;
import com.examportal.server.DTO.ExamResultTimerDTO;
import com.examportal.server.DTO.SessionResultDTO;
import com.examportal.server.DTO.ResponseDTO;
import com.examportal.server.DTO.StudentAnswerAutoGen;
import com.examportal.server.Entity.*;
import com.examportal.server.Request.StudentResultInExamSession;
import com.examportal.server.Service.*;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/exam-result")
public class ApiExamResultController {
    @Autowired
    private ExamResultService examResultService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private ExamService examService;
    @Autowired
    private ExamQuestionService examQuestionService;
    @Autowired
    private StudentAnswerService studentAnswerService;

    @GetMapping("get/list/student/result/in/session/{examSessionId}")
    public ResponseEntity<?> getListStudentResultInSession(@PathVariable Long examSessionId) {
        try {
            List<StudentResultInExamSession> studentList = examResultService
                    .getListStudentResultInExamSession(examSessionId);
            return ResponseEntity.ok(studentList);
        } catch (Exception e) {
            // Log lỗi nếu cần
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PostMapping("/create/new/exam-result/auto-generate")
    public ResponseEntity<?> createNewExamResultAutoGenerate(@RequestBody Long examId, HttpServletRequest request) {
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
            ExamResult examResultcheck = examResultService.getExamResultByExamIdAndUserId(examId, user.getId());
            if (examResultcheck != null) {
                if (examResultcheck.isSubmit() == true) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ResponseDTO("Bạn đã làm bài thi này rồi"));
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Tiếp tục làm bài"));
            }
            Exam exam = examService.getExamById(examId);
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());

            int durationInMinutes = exam.getDuration(); // ví dụ 60
            long durationInMillis = durationInMinutes * 60L * 1000L;

            Timestamp endTime = new Timestamp(timestamp.getTime() + durationInMillis);

            ExamResult examResult = new ExamResult();
            examResult.setExam(exam);
            examResult.setUser(user);
            examResult.setStartTime(timestamp);
            examResult.setEndTime(endTime);
            examResult.setSubmit(false);
            examResultService.save(examResult);
            List<ExamQuestion> examQuestions = examQuestionService.getExamQuestionsByExamId(exam.getId());
            for (int i = 0; i < examQuestions.size(); i++) {
                ExamQuestion examQuestion = examQuestions.get(i);
                StudentAnswer studentAnswer = new StudentAnswer();
                studentAnswer.setStudentId(user.getId());
                studentAnswer.setExamId(exam.getId());
                studentAnswer.setQuestionId(examQuestion.getQuestionId());
                studentAnswer.setQuestionNo(i + 1);
                studentAnswerService.save(studentAnswer);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("examResultId", examResult.getId());
            response.put("examQuestions", examQuestions);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/get/time/remain/exam-result/{examId}")
    public ResponseEntity<?> getTimeRemainExamResult(@PathVariable("examId") Long examId, HttpServletRequest request) {
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
            ExamResult examResult = examResultService.getExamResultByExamIdAndUserId(examId, user.getId());
            if (examResult == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO("Không tìm thấy kết quả thi"));
            }
            ExamResultTimerDTO examResultTimerDTO = new ExamResultTimerDTO();
            examResultTimerDTO.setStartTime(examResult.getStartTime());
            examResultTimerDTO.setEndTime(examResult.getEndTime());
            Map<String, Object> map = new HashMap<>();
            map.put("examResultTimerDTO", examResultTimerDTO);
            return ResponseEntity.ok(map);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }

    }

    @PostMapping("/auto/save/answer-student/{examId}")
    public ResponseEntity<?> AutoSaveAutoGen(@PathVariable("examId") Long examId,
            @RequestBody List<StudentAnswerAutoGen> student_answers,
            HttpServletRequest request) {
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

            for (StudentAnswerAutoGen studentAnswer : student_answers) {
                StudentAnswer studentAnswer1 = studentAnswerService.findStudentAnswerAutogen(
                        user.getId(), examId, studentAnswer.getQuestion_id());
                if (studentAnswer1 != null) {
                    studentAnswer1.setAnswerId(studentAnswer.getSelected_answer_id());
                    studentAnswerService.save(studentAnswer1); // Nếu có save thì nên gọi
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ResponseDTO("Không tìm thấy câu trả lời"));
                }
            }

            return ResponseEntity.ok(new ResponseDTO("Lưu câu trả lời thành công")); // trả về sau khi lặp xong

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/get/list/exam/result")
    public ResponseEntity<?> getListSessionResult(HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || !jwt.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }
            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            Long userId = claims.get("id", Long.class); 
            List<SessionResultDTO> examResults = examResultService.getListSessionResultByUserId(userId);
            return ResponseEntity.ok(examResults);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/get/detail/exam-result/by-session/{examSessionId}")
    public ResponseEntity<?> getDetailExamResultBySession(@PathVariable Long examSessionId, HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || !jwt.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }
            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            Long userId = claims.get("id", Long.class);

            List<Exam> listExam = examService.getExamBySessionId(examSessionId);
            List<Map<String, Object>> results = new ArrayList<>();
            for (Exam exam : listExam) {
                Map<String, Object> examResultList = new HashMap<>();
                ExamResult examResult = examResultService.getExamResultByExamIdAndUserId(exam.getId(), userId);
                if (examResult != null) {
                    examResultList.put("examResultId", examResult.getId());
                    examResultList.put("examId", exam.getId());
                    examResultList.put("examName", exam.getName());
                    examResultList.put("totalScore", examResult.getTotalScore());
                    examResultList.put("startTime", examResult.getStartTime());
                    examResultList.put("endTime", examResult.getEndTime());
                    results.add(examResultList);
                }
            }
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}

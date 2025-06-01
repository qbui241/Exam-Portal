package com.examportal.server.Controllers;

import com.examportal.server.DTO.ResponseDTO;
import com.examportal.server.Entity.QuestionAnswer;
import com.examportal.server.Service.QuestionAnswerService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/question-answer")
public class ApiQuestionAnswerController {

    @Autowired
    private QuestionAnswerService questionAnswerService;

    // ----------------------- Mode UPLOAD -----------------------

    /**
     * POST API cho mode upload.
     * Client gửi payload như:
     * {
     * "examId": 100,
     * "answers": {
     * "1": "B",
     * "2": "C",
     * "3": "A"
     * }
     * }
     */
    @PostMapping(value = "/upload", consumes = {"application/json;charset=UTF-8"})
    public ResponseEntity<?> addUploadQuestionAnswers(@RequestBody Map<String, Object> answerData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy examId từ payload
            Object examIdObj = answerData.get("examId");
            if (examIdObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing 'examId' in request answerData."));
            }
            Long examId = objectMapper.convertValue(examIdObj, Long.class);

            // Lấy answers
            Object answersObj = answerData.get("answers");
            if (answersObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing 'answers' in request answerData."));
            }
            Map<String, String> answerMap = objectMapper.convertValue(answersObj, new TypeReference<>() {
            });
            List<QuestionAnswer> answersToSave = new ArrayList<>();
            String[] defaultLetters = {"A", "B", "C", "D"};

            for (Map.Entry<String, String> entry : answerMap.entrySet()) {
                String key = entry.getKey().trim();
                String correctLetter = entry.getValue().trim();
                try {
                    int questionNo = Integer.parseInt(key);
                    for (int i = 0; i < defaultLetters.length; i++) {
                        QuestionAnswer questionAnswer = new QuestionAnswer();
                        questionAnswer.setId(null); // entity mới
                        questionAnswer.setExam_id(examId);
                        questionAnswer.setQuestionNo(questionNo);
                        questionAnswer.setOrdering(i + 1);
                        questionAnswer.setAnswerText(defaultLetters[i]);
                        questionAnswer.setSource("upload");
                        questionAnswer.setCorrect(defaultLetters[i].equalsIgnoreCase(correctLetter));
                        answersToSave.add(questionAnswer);
                    }
                } catch (NumberFormatException nfe) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Invalid question_no key in upload mode: " + key));
                }
            }
            questionAnswerService.saveAll(answersToSave);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Update question answers saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to save upload question answers: " + e.getMessage()));
        }
    }

    /**
     * GET API cho mode upload.
     * Client truyền examId qua query parameter.
     */
    @GetMapping("/upload")
    public ResponseEntity<?> getUploadQuestionAnswers(@RequestParam("examId") Long examId) {
        try {
            List<QuestionAnswer> allAnswers = questionAnswerService.getList();
            List<QuestionAnswer> filteredAnswers = allAnswers.stream().filter(questionAnswer -> questionAnswer.getExam_id() != null && questionAnswer.getExam_id().equals(examId) && "upload".equalsIgnoreCase(questionAnswer.getSource())).collect(Collectors.toList());
            return ResponseEntity.ok(filteredAnswers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to retrieve upload question answers: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/update", consumes = {"application/json;charset=UTF-8"})
    public ResponseEntity<?> updateUploadQuestionAnswers(@RequestBody Map<String, Object> answerData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy examId từ payload
            Object examIdObj = answerData.get("examId");
            if (examIdObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing 'examId' in request answerData."));
            }
            Long examId = objectMapper.convertValue(examIdObj, Long.class);

            // Lấy answers
            Object answersObj = answerData.get("answers");
            if (answersObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing 'answers' in request answerData."));
            }
            Map<String, String> answerMap = objectMapper.convertValue(answersObj, new TypeReference<>() {
            });
            List<QuestionAnswer> updateAnswers = new ArrayList<>();
            String[] defaultLetters = {"A", "B", "C", "D"};

            for (Map.Entry<String, String> entry : answerMap.entrySet()) {
                String key = entry.getKey().trim();
                String correctLetter = entry.getValue().trim();
                try {
                    int questionNo = Integer.parseInt(key);
                    for (int i = 0; i < defaultLetters.length; i++) {
                        QuestionAnswer questionAnswer = new QuestionAnswer();
                        questionAnswer.setId(null); // entity mới
                        questionAnswer.setExam_id(examId);
                        questionAnswer.setQuestionNo(questionNo);
                        questionAnswer.setOrdering(i + 1);
                        questionAnswer.setAnswerText(defaultLetters[i]);
                        questionAnswer.setSource("upload");
                        questionAnswer.setCorrect(defaultLetters[i].equalsIgnoreCase(correctLetter));
                        updateAnswers.add(questionAnswer);
                    }
                } catch (NumberFormatException nfe) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Invalid question_no key in upload mode: " + key));
                }
            }
            questionAnswerService.update(examId, updateAnswers);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Upload question answers saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Lỗi khi cập nhật câu trả lời: " + e.getMessage()));
        }
    }
    // ----------------------- Mode AUTO-GENERATE -----------------------

    /**
     * POST API cho mode auto-generate.
     * Client gửi payload như:
     * {
     * "answers": {
     * "12345": {
     * "1": "Đáp án đúng",
     * "2": "Đáp án sai 1",
     * "3": "Đáp án sai 2",
     * "4": "Đáp án sai 3"
     * },
     * "12346": {
     * "1": "Đáp án đúng 2",
     * "2": "Đáp án sai A",
     * "3": "Đáp án sai B"
     * }
     * }
     * }
     * Lưu ý: Không có examId trong payload cho mode auto-generate.
     */
    @PostMapping(value = "/auto-generate", consumes = {"application/json;charset=UTF-8"})
    public ResponseEntity<?> addAutoGenerateQuestionAnswers(@RequestBody Map<String, Object> answerData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy answers từ payload
            Object answersObj = answerData.get("answers");
            if (answersObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing 'answers' in request answerData."));
            }
            Map<String, Map<String, String>> answerMap = objectMapper.convertValue(answersObj, new TypeReference<>() {
            });
            List<QuestionAnswer> answersToSave = new ArrayList<>();
            for (Map.Entry<String, Map<String, String>> entry : answerMap.entrySet()) {
                String questionIdKey = entry.getKey().trim();
                Map<String, String> answerObj = entry.getValue();
                if (answerObj == null || answerObj.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("No answers provided for question: " + questionIdKey));
                }
                // Sắp xếp các key của answerObj theo thứ tự số tăng dần
                List<Integer> orderings = answerObj.keySet().stream().map(s -> {
                    try {
                        return Integer.parseInt(s);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }).filter(Objects::nonNull).sorted().toList();
                if (orderings.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("No valid ordering keys for question: " + questionIdKey));
                }
                Long questionId;
                try {
                    questionId = Long.parseLong(questionIdKey);
                } catch (NumberFormatException nfe) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Invalid question_id key in auto-generate mode: " + questionIdKey));
                }
                for (Integer ord : orderings) {
                    String ansText = answerObj.get(String.valueOf(ord));
                    if (ansText == null) continue;
                    QuestionAnswer questionAnswer = new QuestionAnswer();
                    questionAnswer.setId(null);
                    questionAnswer.setQuestion_id(questionId);
                    questionAnswer.setOrdering(ord);
                    questionAnswer.setAnswerText(ansText.trim());
                    questionAnswer.setSource("auto-generate");
                    questionAnswer.setCorrect(ord.equals(orderings.getFirst())); // bản ghi có ordering nhỏ nhất là đáp án đúng
                    answersToSave.add(questionAnswer);
                }
            }
            questionAnswerService.saveAll(answersToSave);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Auto-generated question answers saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to save auto-generated question answers: " + e.getMessage()));
        }
    }

    /**
     * GET API cho mode auto-generate.
     * Client truyền questionId qua query parameter để lấy danh sách câu trả lời có source là "auto-generate".
     */
    @GetMapping("/auto-generate")
    public ResponseEntity<?> getAutoGenerateQuestionAnswers(@RequestParam("questionId") Long questionId) {
        try {
            List<QuestionAnswer> allAnswers = questionAnswerService.getList();
            List<QuestionAnswer> filtered = allAnswers.stream().filter(qa -> "auto-generate".equalsIgnoreCase(qa.getSource()) && qa.getQuestion_id() != null && qa.getQuestion_id().equals(questionId)).collect(Collectors.toList());
            return ResponseEntity.ok(filtered);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to retrieve auto-generate question answers: " + e.getMessage()));
        }
    }

    @GetMapping("auto-generate/random/by/quesionId/{questionId}")
    public ResponseEntity<?> getAnswersByQuestionIdRand(@PathVariable Long questionId) {
        try {
            List<QuestionAnswer> answers = questionAnswerService.getAnswersByQuestionIdRand(questionId);
            return ResponseEntity.ok(answers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to retrieve answers: " + e.getMessage()));
        }
    }

    @PutMapping("/auto-generate/{questionId}")
    public ResponseEntity<?> updateAutoGenerateQuestionAnswers(@PathVariable Long questionId, @RequestBody Map<String, String> answers) {
        try {
            if (answers == null || answers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Missing or empty 'answers' in request body."));
            }
            List<QuestionAnswer> updateAnswers = new ArrayList<>();
            List<Integer> orderings = answers.keySet().stream().map(s -> {
                try {
                    return Integer.parseInt(s);
                } catch (NumberFormatException e) {
                    return null;
                }
            }).filter(Objects::nonNull).sorted().toList();
            if (orderings.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("No valid ordering keys for question: " + questionId));
            }
            for (Integer ord : orderings) {
                String ansText = answers.get(String.valueOf(ord));
                if (ansText == null) continue;
                QuestionAnswer questionAnswer = new QuestionAnswer();
                questionAnswer.setId(null);
                questionAnswer.setQuestion_id(questionId);
                questionAnswer.setOrdering(ord);
                questionAnswer.setAnswerText(ansText.trim());
                questionAnswer.setSource("auto-generate");
                questionAnswer.setCorrect(ord.equals(orderings.getFirst()));
                updateAnswers.add(questionAnswer);
            }
            questionAnswerService.update(questionId, updateAnswers);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Auto-generate question answers updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Failed to update auto-generate question answers: " + e.getMessage()));
        }
    }
}

export interface Exam {
  id: number;                 // ID của đề thi
  examSessionId: number;      // ID của kỳ thi theo đợt
  name: string;               // Tên đề thi
  description: string;        // Mô tả đề thi
  type: string;               // Loại đề thi (upload-file hoặc auto-generate)
  totalQuestions: number;     // Số lượng câu hỏi
  duration: number;           // Thời gian làm bài (phút)
  subject: string;            // Môn thi
  fileUrl: string | null;     // Đường dẫn file đề thi (nếu có)
  createDate: Date;         // Ngày tạo đề thi (ISO 8601 string)
  startDate: Date;          // Ngày bắt đầu đề thi (ISO 8601 string)
  endDate: Date;            // Ngày kết thúc đề thi (ISO 8601 string)
}


// Interface cho Answer
export interface Answer {
  answer_id: number;
  answer_text: string;
}

// Interface cho Question
export interface Question {
  question_id: number;
  question_text: string;
  question_answers: Answer[];
}

// Interface cho ExamData
export interface ExamData {
  exam_id: number;
  questions: Question[];
}

export interface StudentAnswer {
  question_id: number;
  selected_answer_id: number | null;
}

interface StudentSubmission {
  student_id: number;
  exam_id: number;
  answers: StudentAnswer[];
}

export interface ExamTimer {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface ExamResultTimer{
  startTime: Date;
  endTime: Date;
}

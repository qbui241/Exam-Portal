interface Answer {
  answer_id: number;
  answer_text: string;
}

interface Question {
  question_id: number;
  question_text: string;
  answers: Answer[];
}

interface ExamData {
  exam_id: number;
  question_answers: Question[];
}

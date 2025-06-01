export interface Answer {
  id: number;
  question_id: number | null;
  exam_id: number;
  questionNo: number;
  answerText: string;
  ordering: number;
  source: string;
  correct: boolean;
}

export interface StudentAnswerDTO {
  questionNo: number;
  answerText: string;
}

export interface ExamStateResponse {
  message: string;
  endTime: string;
  answers: StudentAnswerDTO[];
}

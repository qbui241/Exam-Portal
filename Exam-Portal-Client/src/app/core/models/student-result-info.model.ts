export interface StudentResultInfo {
  student_name: string;
  student_number: number;
  class_name: string;
  exam_name: string;
  total_score: number;
  submit_time: Date; // Hoặc Date nếu muốn parse thành đối tượng Date
}

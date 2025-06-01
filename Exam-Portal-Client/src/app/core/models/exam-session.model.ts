export interface ExamSession {
  id: number; // Khóa chính, tự động tăng
  teacher_id: number; // ID giáo viên
  name: string; // Tên kỳ thi
  description: string; // Mô tả
  startDate: Date; // Ngày giờ bắt đầu
  endDate: Date; // Ngày giờ thúc
  createDate: Date; // Ngày giờ tạo
  code: string; // Mã kỳ thi
  password: string; // Mật khẩu
}

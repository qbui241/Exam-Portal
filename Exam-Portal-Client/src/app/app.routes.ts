import { Routes } from "@angular/router";
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { StudentLoginComponent } from "./pages/login/student-login/student-login.component";
import { TeacherLoginComponent } from "./pages/login/teacher-login/teacher-login.component";
import { StudentSignupComponent } from "./pages/sign-up/student-signup/student-signup.component";
import { TeacherSignupComponent } from "./pages/sign-up/teacher-signup/teacher-signup.component";
import { StudentHomeComponent } from "./pages/home/student-home/student-home.component";
import { TeacherHomeComponent } from "./pages/home/teacher-home/teacher-home.component";
import { ExamSessionComponent } from "./pages/student/exam-session/exam-session.component";
import { DoTestUploadComponent } from "./pages/student/do-test-upload/do-test-upload.component";
import { ResultsComponent } from "./pages/student/results/results.component";
import { UserFormComponent } from "./shared/components/user-form/user-form.component";
import { ExamSessionDetailComponent } from "./pages/student/exam-session-detail/exam-session-detail.component";
import { ExamCreateTypeComponent } from "./pages/teacher/exam-create-type/exam-create-type.component";
import { ExamCreateWithFileComponent } from "./pages/teacher/exam/with-file/exam-create-with-file/exam-create-with-file.component";
import { CreateExamSessionComponent } from "./pages/teacher/exam_session/create-exam-session/create-exam-session.component";
import { ExamSessionDashboardComponent } from "./pages/teacher/exam_session/exam-session-dashboard/exam-session-dashboard.component";
import { CreateAutoGenerateComponent } from "./pages/teacher/exam/auto-generate/create-auto-generate/create-auto-generate.component";
import { QuestionComponent } from "./pages/teacher/exam/auto-generate/create-auto-generate/question/question.component";
import { InfoComponent } from "./pages/teacher/exam/auto-generate/create-auto-generate/info/info.component";
import { LoadingComponent } from "./layout/loadings/loading/loading.component";
import { LoadingLineComponent } from "./layout/loadings/loading-line/loading-line.component";
import { EditExamWithFileComponent } from "./pages/teacher/exam/with-file/edit-exam-with-file/edit-exam-with-file.component";
import { TeacherUserComponent } from "./pages/user/teacher-user/teacher-user.component";
import { StudentUserComponent } from "./pages/user/student-user/student-user.component";
import { QuestionBankComponent } from "./pages/teacher/exam_session/exam-session-dashboard/question-bank/question-bank.component";
import { DoTestAutogenComponent } from "./pages/student/do-test-autogen/do-test-autogen.component";
import {ExamQuestionListComponent} from "./pages/teacher/exam_session/exam-session-dashboard/exam/exam-question-list/exam-question-list.component";

export const routes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "login/student", component: StudentLoginComponent },
  { path: "login/teacher", component: TeacherLoginComponent },
  { path: "sign-up/student", component: StudentSignupComponent },
  { path: "sign-up/teacher", component: TeacherSignupComponent },
  { path: "home/student", component: StudentHomeComponent },
  { path: "home/teacher", component: TeacherHomeComponent },
  { path: "student/exam-session", component: ExamSessionComponent },
  { path: "student/do-test-upload", component: DoTestUploadComponent },
  { path: "student/do-test-autogen", component: DoTestAutogenComponent },
  { path: "student/results", component: ResultsComponent },
  { path: "user-form", component: UserFormComponent },
  { path: "student/user", component: StudentUserComponent },
  { path: "teacher/user", component: TeacherUserComponent },
  { path: "student/results", component: ResultsComponent },
  {
    path: "student/exam-session-detail",
    component: ExamSessionDetailComponent,
  },
  { path: "teacher/exam-create-type", component: ExamCreateTypeComponent },
  {
    path: "teacher/exam-create-with-file",
    component: ExamCreateWithFileComponent,
  },
  {
    path: "teacher/create-exam-session",
    component: CreateExamSessionComponent,
  },
  {
    path: "teacher/exam-session-dashboard",
    component: ExamSessionDashboardComponent,
  },
  {
    path: "exam/auto-generate/create-auto-generate",
    component: CreateAutoGenerateComponent,
    children: [
      { path: "question", component: QuestionComponent },
      { path: "info", component: InfoComponent },
      { path: "", redirectTo: "question", pathMatch: "full" },
    ],
  },
  {
    path: "exam/auto-generate/create-auto-generate/question",
    component: QuestionComponent,
  },
  { path: "loading", component: LoadingComponent },
  { path: "loading-line", component: LoadingLineComponent },
  { path: "teacher/edit-exam-with-file", component: EditExamWithFileComponent },
  {
    path: "teacher/exam-session-dashboard/question-bank",
    component: QuestionBankComponent,
  },
  {
    path: "teacher/exam/auto-generate/exam-question-list",
    component: ExamQuestionListComponent,
  }
];

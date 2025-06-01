import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-button',
  imports: [],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.scss'
})
export class CreateButtonComponent {
  constructor(private router: Router) {
  }

  navigateToCreateExam() {
    this.router.navigate(['teacher/create-exam-session']);
  }
}

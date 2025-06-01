import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  subject: string = 'Toán-GK';
  @Input() points: string = '10/10';
  @Input() time: string = '100';
  @Input() timeSubmit: string = '100';
  @Input() numberCorrectAnswer: number = 0;
  @Input() numberWrongAnswer: number = 0;
  @Input() numberNotSubmitAnswer: number = 0;

  constructor(private router: Router) {
  }

  return() {
    this.router.navigate(['student/exam']);
  }
}

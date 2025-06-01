import {Component} from '@angular/core';
import {HeaderComponent} from "../header.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header-student',
  imports: [
    HeaderComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header-student.component.html',
  styleUrl: './header-student.component.scss'
})
export class HeaderStudentComponent {

}

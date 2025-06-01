import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  standalone: true,
  imports: [FormsModule, NgForOf]
})
export class WelcomePageComponent implements AfterViewInit {
  selectedRole: string = 'Tôi là học sinh';

  constructor(private router: Router) {
  }

  onContinue() {
    if (this.selectedRole === 'Tôi là học sinh') {
      this.router.navigate(['/login/student']).then(() => console.log('Navigate to student login'));
    } else if (this.selectedRole === 'Tôi là giáo viên') {
      this.router.navigate(['/login/teacher']).then(() => console.log('Navigate to teacher login'));
    }
  }

  onRegister() {
    if (this.selectedRole === 'Tôi là học sinh') {
      this.router.navigate(['/sign-up/student']).then(() => console.log('Navigate to student sign up'));
    } else if (this.selectedRole === 'Tôi là giáo viên') {
      this.router.navigate(['/sign-up/teacher']).then(() => console.log('Navigate to teacher sign up'));
    }
  }

  ngAfterViewInit() {
    const elements = document.querySelectorAll('.led-effect');

    elements.forEach(element => {
      // @ts-ignore
      const text = element.textContent.trim();
      let html = '';

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          html += ' ';
        } else {
          html += `<span style="animation-delay: ${i * 0.1}s">${text[i]}</span>`;
        }
      }

      element.innerHTML = html;
    });
  }
}

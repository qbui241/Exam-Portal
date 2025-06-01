import {Component} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  textColor: string = '#686868';

  changeColor() {
    this.textColor = '#686868';
  }

}


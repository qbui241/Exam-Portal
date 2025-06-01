import {Component, ElementRef, EventEmitter, Input, Output,} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "app-header-back",
  imports: [],
  templateUrl: "./header-back.component.html",
  styleUrl: "./header-back.component.scss",
})
export class HeaderBackComponent {
  @Input() backRoute: string = "/home/teacher";
  @Output() backClicked = new EventEmitter<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {
  }

  goBack() {
    this.backClicked.emit();
    this.router.navigate([this.backRoute]);
  }
}

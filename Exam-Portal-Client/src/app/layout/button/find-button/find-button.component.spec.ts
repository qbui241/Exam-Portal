import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FindButtonComponent} from './find-button.component';

describe('FindButtonComponent', () => {
  let component: FindButtonComponent;
  let fixture: ComponentFixture<FindButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FindButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

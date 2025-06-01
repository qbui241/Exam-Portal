import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeacherUserComponent} from './teacher-user.component';

describe('TeacherUserComponent', () => {
  let component: TeacherUserComponent;
  let fixture: ComponentFixture<TeacherUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherUserComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TeacherUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

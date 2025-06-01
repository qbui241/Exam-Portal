import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TeacherLoginComponent} from './teacher-login.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('TeacherLoginComponent', () => {
  let component: TeacherLoginComponent;
  let fixture: ComponentFixture<TeacherLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLoginComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student login on user type change', () => {
    spyOn(component['router'], 'navigate');
    component.onUserTypeChange();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login/student']);
  });
});

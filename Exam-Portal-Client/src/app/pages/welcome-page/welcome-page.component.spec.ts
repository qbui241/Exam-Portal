import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WelcomePageComponent} from './welcome-page.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomePageComponent, RouterTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student login on continue', () => {
    spyOn(component['router'], 'navigate');
    component.selectedRole = 'Tôi là học sinh';
    component.onContinue();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login/student']);
  });

  it('should navigate to teacher login on continue', () => {
    spyOn(component['router'], 'navigate');
    component.selectedRole = 'Tôi là giáo viên';
    component.onContinue();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login/teacher']);
  });
});

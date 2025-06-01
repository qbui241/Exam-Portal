import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to student signup on register click', () => {
    spyOn(component['router'], 'navigate');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/sign_up/student']);
  });
});

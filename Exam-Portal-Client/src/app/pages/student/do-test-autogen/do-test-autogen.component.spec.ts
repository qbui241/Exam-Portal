import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoTestAutogenComponent } from './do-test-autogen.component';

describe('DoTestAutogenComponent', () => {
  let component: DoTestAutogenComponent;
  let fixture: ComponentFixture<DoTestAutogenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoTestAutogenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoTestAutogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingLineComponent} from './loading-line.component';

describe('LoadingLineComponent', () => {
  let component: LoadingLineComponent;
  let fixture: ComponentFixture<LoadingLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingLineComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoadingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

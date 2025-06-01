import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DoTestUploadComponent} from './do-test-upload.component';

describe('DoTestComponent', () => {
  let component: DoTestUploadComponent;
  let fixture: ComponentFixture<DoTestUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoTestUploadComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DoTestUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

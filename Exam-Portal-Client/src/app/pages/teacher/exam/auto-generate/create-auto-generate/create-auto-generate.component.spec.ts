import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAutoGenerateComponent} from './create-auto-generate.component';

describe('CreateAutoGenerateComponent', () => {
  let component: CreateAutoGenerateComponent;
  let fixture: ComponentFixture<CreateAutoGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAutoGenerateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateAutoGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

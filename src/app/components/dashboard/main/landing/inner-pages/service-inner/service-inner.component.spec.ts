import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInnerComponent } from './service-inner.component';

describe('ServiceInnerComponent', () => {
  let component: ServiceInnerComponent;
  let fixture: ComponentFixture<ServiceInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceInnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

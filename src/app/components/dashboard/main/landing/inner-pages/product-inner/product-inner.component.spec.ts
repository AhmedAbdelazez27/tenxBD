import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInnerComponent } from './product-inner.component';

describe('ProductInnerComponent', () => {
  let component: ProductInnerComponent;
  let fixture: ComponentFixture<ProductInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

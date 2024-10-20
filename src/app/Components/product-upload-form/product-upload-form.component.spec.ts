import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUploadFormComponent } from './product-upload-form.component';

describe('ProductUploadFormComponent', () => {
  let component: ProductUploadFormComponent;
  let fixture: ComponentFixture<ProductUploadFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductUploadFormComponent]
    });
    fixture = TestBed.createComponent(ProductUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

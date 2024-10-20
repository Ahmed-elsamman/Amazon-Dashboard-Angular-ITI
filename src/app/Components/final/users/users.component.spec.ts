import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupensComponent } from './users.component';

describe('CoupensComponent', () => {
  let component: CoupensComponent;
  let fixture: ComponentFixture<CoupensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoupensComponent]
    });
    fixture = TestBed.createComponent(CoupensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

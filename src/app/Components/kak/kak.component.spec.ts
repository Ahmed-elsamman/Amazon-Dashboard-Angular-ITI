import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakComponent } from './kak.component';

describe('KakComponent', () => {
  let component: KakComponent;
  let fixture: ComponentFixture<KakComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KakComponent]
    });
    fixture = TestBed.createComponent(KakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

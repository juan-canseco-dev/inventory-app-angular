import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableComponent } from './enable.component';

describe('EnableComponent', () => {
  let component: EnableComponent;
  let fixture: ComponentFixture<EnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

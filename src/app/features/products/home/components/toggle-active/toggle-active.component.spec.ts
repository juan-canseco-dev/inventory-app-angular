import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleActiveComponent } from './toggle-active.component';

describe('ToggleActiveComponent', () => {
  let component: ToggleActiveComponent;
  let fixture: ComponentFixture<ToggleActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleActiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

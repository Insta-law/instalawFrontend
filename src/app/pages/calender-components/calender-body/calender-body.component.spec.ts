import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderBodyComponent } from './calender-body.component';

describe('CalenderBodyComponent', () => {
  let component: CalenderBodyComponent;
  let fixture: ComponentFixture<CalenderBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalenderBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

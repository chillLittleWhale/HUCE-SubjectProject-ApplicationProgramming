import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomalConverPopupComponent } from './nomal-conver-popup.component';

describe('NomalConverPopupComponent', () => {
  let component: NomalConverPopupComponent;
  let fixture: ComponentFixture<NomalConverPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NomalConverPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NomalConverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConverPopupComponent } from './group-conver-popup.component';

describe('GroupConverPopupComponent', () => {
  let component: GroupConverPopupComponent;
  let fixture: ComponentFixture<GroupConverPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupConverPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupConverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

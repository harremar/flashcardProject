import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeckComponent } from './update-deck.component';

describe('UpdateDeckComponent', () => {
  let component: UpdateDeckComponent;
  let fixture: ComponentFixture<UpdateDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDeckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

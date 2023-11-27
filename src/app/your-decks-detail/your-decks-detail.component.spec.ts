import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourDecksDetailComponent } from './your-decks-detail.component';

describe('YourDecksDetailComponent', () => {
  let component: YourDecksDetailComponent;
  let fixture: ComponentFixture<YourDecksDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourDecksDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourDecksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

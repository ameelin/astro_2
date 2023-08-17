import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMatchesComponent } from './show-matches.component';

describe('ShowMatchesComponent', () => {
  let component: ShowMatchesComponent;
  let fixture: ComponentFixture<ShowMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMatchesComponent]
    });
    fixture = TestBed.createComponent(ShowMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

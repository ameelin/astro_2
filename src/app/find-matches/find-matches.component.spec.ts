import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMatchesComponent } from './find-matches.component';

describe('FindMatchesComponent', () => {
  let component: FindMatchesComponent;
  let fixture: ComponentFixture<FindMatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindMatchesComponent]
    });
    fixture = TestBed.createComponent(FindMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

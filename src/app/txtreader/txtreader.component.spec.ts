import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxtreaderComponent } from './txtreader.component';

describe('TxtreaderComponent', () => {
  let component: TxtreaderComponent;
  let fixture: ComponentFixture<TxtreaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxtreaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxtreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

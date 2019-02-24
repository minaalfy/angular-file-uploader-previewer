import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgpreviewerComponent } from './imgpreviewer.component';

describe('ImgpreviewerComponent', () => {
  let component: ImgpreviewerComponent;
  let fixture: ComponentFixture<ImgpreviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgpreviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgpreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter:jasmine.SpyObj<Router>;

  beforeEach(async () => {

    mockRouter=jasmine.createSpyObj('Router',['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers:[
        { provide: Router, useValue: mockRouter },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick',()=>{
    component.onGetStarted();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  })
});

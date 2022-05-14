import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';

import { IssueComponent } from './issue.component';
import { StepService } from './services/step.service';
import { PsbModule } from '../psb/psb.module';
import { IssueStepsComponent } from './components/issue-steps/issue-steps.component';

import { NgService, StoreService } from 'src/app/services';

describe('IssueComponent', () => {
  let component: IssueComponent;
  let fixture: ComponentFixture<IssueComponent>;
  let location: Location;
  let router: Router;
  let ngService: NgService;

  beforeEach(waitForAsync(() => {
    const mockStore = {
      isIssueVissible: false,
    };

    TestBed.configureTestingModule({
      declarations: [
        IssueComponent,
        IssueStepsComponent,
      ],
      imports: [
        RouterTestingModule,
        PsbModule,
      ],
      providers: [
        StepService,
        {
          provide: NgService,
          useValue: jasmine.createSpyObj('NgService', ['showSmbDocuments']),
        },
        {
          provide: StoreService,
          useValue: mockStore,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(IssueComponent);
    component = fixture.componentInstance;
    ngService = TestBed.inject(NgService);

    fixture.detectChanges();
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigateBack while clicking back button', () => {
    spyOn(component, 'navigateBack');
    const backButton = fixture.debugElement.query(By.css('.back-btn'));

    backButton.nativeElement.click();

    expect(component.navigateBack).toHaveBeenCalled();
  });

  it('should navigate back on prev step', () => {
    spyOn(router, 'navigateByUrl');
    component.currentUrl = component.steps[1].url;

    component.navigateBack();

    expect(router.navigateByUrl).toHaveBeenCalledWith(component.steps[0].url);
  });

  it('should call showSmbDocuments if navigating back on fist step', () => {
    ngService = TestBed.inject(NgService);
    component.currentUrl = component.steps[0].url;

    component.navigateBack();

    expect(ngService.showSmbDocuments).toHaveBeenCalled();
  });
});

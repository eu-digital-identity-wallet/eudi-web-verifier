import { TestBed } from '@angular/core/testing';

import { NavigateService } from './navigate.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NavigateService', () => {
  let service: NavigateService;
  // let router:Router;
  // let location:Location;
  // let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   RouterTestingModule.withRoutes(
      //     [{path: '', component: ''}, {path: 'home', component: ''}]
      //   )
      // ]
    });
    service = TestBed.inject(NavigateService);
    // router = TestBed.get(Router);
    // location = TestBed.get(Location);
    // navigateSpy = jest.spyOn(router, 'createUrlTree');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // it('should be go home', () => {
  //   service.goHome();

  //   expect(location.path()).toBe(['/home']);
  // });
  // it('should be go back to previous location', () => {
  //   expect(service).toBeTruthy();
  // });
  // it('should be navigateTo a location', () => {
  //   expect(service).toBeTruthy();
  // });
});

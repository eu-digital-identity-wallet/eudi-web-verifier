import { TestBed } from '@angular/core/testing';

import { OnlineAuthenticationSIOPService } from './online-authentication-siop.service';
import { HttpService } from '../network/http/http.service';
import { asyncData } from 'src/testing/async-observable-helpers';
import { PresentationDefinitionResponse } from '../models/presentation-definition-response';

const mocResponseData: PresentationDefinitionResponse = {
  client_id: 'client_id',
  request_uri: 'request_uri',
  presentation_id: 'presentation_id'
}

describe('OnlineAuthenticationSIOPService', () => {
  let service: OnlineAuthenticationSIOPService;
  let HttpServiceSpy: jasmine.SpyObj<HttpService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['post']);
    TestBed.configureTestingModule({
      providers: [OnlineAuthenticationSIOPService, { provide: HttpService, useValue: spy }]
    });
    service = TestBed.inject(OnlineAuthenticationSIOPService);
    HttpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#init transaction for the siop should return expected an object of PresentationDefinitionResponse (called once)', (done: DoneFn) => {
    HttpServiceSpy.post.and.returnValue(asyncData(mocResponseData));

    service.initTransaction().subscribe(
        res => {
            expect(res).toEqual(mocResponseData);
            done();
        },
        done.fail
    );
    expect(HttpServiceSpy.post.calls.count()).toBe(1, 'one call');
  });
  it('#init transaction for the CBOR should return expected an object of PresentationDefinitionResponse (called once)', (done: DoneFn) => {
    HttpServiceSpy.post.and.returnValue(asyncData(mocResponseData));

    service.initCborTransaction().subscribe(
        res => {
            expect(res).toEqual(mocResponseData);
            done();
        },
        done.fail
    );
    expect(HttpServiceSpy.post.calls.count()).toBe(1, 'one call');
  });
});

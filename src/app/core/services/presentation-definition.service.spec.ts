import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing'
import { of, throwError } from 'rxjs';
import { PresentationDefinitionService } from './presentation-definition.service';
import { HttpService } from '../network/http/http.service';
import { asyncData } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';
import { PresentationsResponse } from '../models/presentations-response';

const presentation_id = 'F8pqt-RNeJ7EMpGc0dpWn7ySUId0cfszb1UezseLFP5dpzAuGL6Il1F26oXy9Be0nzJtq8QBtzA5Qrsuv1ybKQ';
const nonce = 'nonce';
const token = 'o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBleBhldS5ldXJvcGEuZWMuZXVkaXcucGlkLjFsaXNzdWVyU2lnbmVkompuYW1lU3BhY2VzoXgYZXUuZXVyb3BhLmVjLmV1ZGl3LnBpZC4xkNgYWFikaGRpZ2VzdElEE2ZyYW5kb21QSmzzPZyCDv1T17NLxFK'
const CBORData: any = {
  presentation_submission: '',
  id_token: token,
  vp_token: token
};


describe('PresentationDefinitionService', () => {
  let service: PresentationDefinitionService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['post', 'get']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PresentationDefinitionService, { provide: HttpService, useValue: spy }]
    });
    service = TestBed.inject(PresentationDefinitionService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be illustrated be a polling request and return vp_token data (called once)', (done: DoneFn) => {

    httpServiceSpy.get.and.returnValue(asyncData(CBORData));
    service.getWalletResponse(presentation_id, nonce).subscribe({
      next(value) {
        expect(value.vp_token).toEqual(token);
        done();
      },
      error() {
        fail('not be called');
      },
    })
    expect(httpServiceSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should be illustrated be a polling request and return ip_token data (called once)', (done: DoneFn) => {

    httpServiceSpy.get.and.returnValue(asyncData(CBORData));
    service.getWalletResponse(presentation_id, nonce).subscribe({
      next(value) {
        expect(value.id_token).toBe(token);
        done();
      },
      error() {
        fail('not be called');
      },
    })
    expect(httpServiceSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should be illustrated be a polling request and return 400 Bad request (called once)', (done: DoneFn) => {

    const errorResponse = new HttpErrorResponse({
      error: 'test 400 error',
      status: 400, statusText: '400 Bad Request'
    });
    const source = throwError(errorResponse);
    httpServiceSpy.get.and.returnValue(source);
    service.getWalletResponse(presentation_id, nonce).subscribe({
      next() {},
      error(err) {
        expect(err.message).toContain('400 Bad Request');
        expect(err.status).toBe(400);
        done();
      },
    })
    expect(httpServiceSpy.get.calls.count()).toBe(1, 'one call');
  });
});

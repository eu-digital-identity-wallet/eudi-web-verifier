import { TestBed } from '@angular/core/testing';

import { VerifierEndpointService } from './verifier-endpoint.service';
import { HttpService } from '@network/http/http.service';
import { InitializedTransaction } from '../models/InitializedTransaction';
import { TransactionInitializationRequest } from '../models/TransactionInitializationRequest';
import { of } from 'rxjs';

const mockResponseData: InitializedTransaction = {
  client_id: 'client_id',
  request_uri: 'request_uri',
  request_uri_method: 'get',
  transaction_id: 'transaction_id',
};

describe('VerifierEndpointService', () => {
  let service: VerifierEndpointService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['post']);
    TestBed.configureTestingModule({
      providers: [
        VerifierEndpointService,
        { provide: HttpService, useValue: spy },
      ],
    });
    service = TestBed.inject(VerifierEndpointService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize transaction', () => {
    httpServiceSpy.post.and.returnValue(of(mockResponseData));
    service.initializeTransaction({} as TransactionInitializationRequest, () => {});
    expect(httpServiceSpy.post).toHaveBeenCalled();
  });

});

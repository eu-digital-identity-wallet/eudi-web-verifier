import { TestBed } from '@angular/core/testing';

import { VerifierEndpointService } from './verifier-endpoint.service';
import { HttpService } from '@network/http/http.service';
import { asyncData } from 'src/testing/async-observable-helpers';
import { InitializedTransaction } from '../models/InitializedTransaction';
import {PresentationRequestUtils} from "@core/services/presentation-request-utils.service";

const mocResponseData: InitializedTransaction = {
  client_id: 'client_id',
  request_uri: 'request_uri',
  transaction_id: 'transaction_id'
}

describe('VerifierEndpointService', () => {
  let service: VerifierEndpointService;
  let presentationRequestUtils: PresentationRequestUtils;
  let HttpServiceSpy: jasmine.SpyObj<HttpService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['post']);
    TestBed.configureTestingModule({
      providers: [VerifierEndpointService, { provide: HttpService, useValue: spy }]
    });
    service = TestBed.inject(VerifierEndpointService);
    HttpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#init transaction for the CBOR should return expected an object of PresentationDefinitionResponse (called once)', (done: DoneFn) => {
    HttpServiceSpy.post.and.returnValue(asyncData(mocResponseData));
    let request = presentationRequestUtils.trademarkVcPresentationRequest("test");
    service.initializeTransaction(request,
        res => {
            expect(res).toEqual(mocResponseData);
            done();
        }
    );
    expect(HttpServiceSpy.post.calls.count()).toBe(1, 'one call');
  });
});

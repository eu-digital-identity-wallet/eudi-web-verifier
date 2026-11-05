import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { QrCodeComponent } from './qr-code.component';
import { SharedModule } from '@shared/shared.module';
import { WalletLayoutComponent } from '@core/layout/wallet-layout/wallet-layout.component';
import { RouterModule } from '@angular/router';
import { NavigateService } from '@core/services/navigate.service';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { DeviceDetectorService } from '@core/services/device-detector.service';
import { WalletResponse } from '@core/models/WalletResponse';
import { EventLog } from '@core/models/EventLog';
import { GetWalletResponseErrorCode, PresentationEventName } from '@core/models/WalletResponseErrors';

describe('QrCodeComponent', () => {
  let component: QrCodeComponent;
  let fixture: ComponentFixture<QrCodeComponent>;
  let getWalletResponseSpy: jasmine.Spy;
  let getsTransactionEventsLogsSpy: jasmine.Spy;

  const activeTransaction = {
    initialized_transaction: {
      client_id: 'Verifier',
      request_uri: 'http://localhost:8080/wallet/request.jwt/abc',
      request_uri_method: 'get',
      transaction_id: 'tx-123',
      authorization_request_uri: 'http://localhost:8080/wallet/request.jwt/abc',
    },
    initialization_request: {
      nonce: 'nonce-123',
      dcql_query: { credentials: [{ id: 'credential-1', format: 'jwt_vc_json' }] },
    },
  };

  const notSubmittedError = () =>
    new HttpErrorResponse({ status: 400, error: { error: GetWalletResponseErrorCode.PRESENTATION_NOT_SUBMITTED } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletLayoutComponent, RouterModule, SharedModule],
      providers: [
        NavigateService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeComponent);
    component = fixture.componentInstance;

    const verifierEndpointService = (component as any).verifierEndpointService as VerifierEndpointService;
    getWalletResponseSpy = spyOn(verifierEndpointService, 'getWalletResponse');
    getsTransactionEventsLogsSpy = spyOn(verifierEndpointService, 'getsTransactionEventsLogs').and.returnValue(of([]));

    const localStorageService = TestBed.inject(LocalStorageService);
    spyOn(localStorageService, 'get').and.returnValue(JSON.stringify(activeTransaction));
    spyOn(localStorageService, 'remove');

    const deviceDetectorService = TestBed.inject(DeviceDetectorService);
    spyOn(deviceDetectorService, 'isDesktop').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep polling while the wallet has not submitted a response', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(throwError(notSubmittedError));
    fixture.detectChanges();
    tick(2000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
    expect(component.errorMessage).toBeNull();
    tick(2000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(2);
  }));

  it('should keep polling on 404', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBeNull();
    tick(2000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(2);
  }));

  it('should conclude the transaction on a successful wallet response', fakeAsync(() => {
    const walletResponse: WalletResponse = { vp_token: { 'credential-1': ['token'] } };
    getWalletResponseSpy.and.returnValue(of(walletResponse));
    const emitSpy = spyOn(component, 'emitTransactionConcludedEvent');
    fixture.detectChanges();
    tick(2000);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(component.errorMessage).toBeNull();
    tick(4000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should stop polling and show the wallet error when the response contains an error', fakeAsync(() => {
    const walletResponse: WalletResponse = {
      vp_token: {},
      error: 'access_denied',
      error_description: 'The user cancelled the presentation',
    };
    getWalletResponseSpy.and.returnValue(of(walletResponse));
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBe('The user cancelled the presentation');
    tick(4000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should stop polling and show an error message on a terminal HTTP error', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500, error: 'Internal Server Error' }))
    );
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBe('Internal Server Error');
    tick(4000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should show a timeout message after 60 polls without a response', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(throwError(notSubmittedError));
    fixture.detectChanges();
    tick(2000 * 60);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(60);
    expect(component.errorMessage).toContain('No response was received from the wallet');
  }));

  it('should stop polling and show the cause when the wallet submission was rejected', fakeAsync(() => {
    const cause =
      "vp_token is not valid: DeviceResponse contains invalid documents: 'X5CNotTrusted(cause=Issuer X5C not trusted)'";
    const failedEvent: EventLog = {
      timestamp: 0,
      event: PresentationEventName.WALLET_FAILED_TO_POST,
      actor: 'Wallet',
      data: { cause },
    };
    getWalletResponseSpy.and.returnValue(throwError(notSubmittedError));
    getsTransactionEventsLogsSpy.and.returnValue(of([failedEvent]));
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBe(cause);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
    tick(4000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
  }));

  it('should keep polling when the events log has no failed submission', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(throwError(notSubmittedError));
    getsTransactionEventsLogsSpy.and.returnValue(of([]));
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBeNull();
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(1);
    tick(2000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(2);
  }));

  it('should keep polling when the events request fails', fakeAsync(() => {
    getWalletResponseSpy.and.returnValue(throwError(notSubmittedError));
    getsTransactionEventsLogsSpy.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 }))
    );
    fixture.detectChanges();
    tick(2000);
    expect(component.errorMessage).toBeNull();
    tick(2000);
    expect(getWalletResponseSpy).toHaveBeenCalledTimes(2);
  }));
});

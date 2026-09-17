import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { ActiveTransaction } from '@core/models/ActiveTransaction';

/**
 * Resolves the DC API request for a transaction id received from the URL,
 * requesting it from the backend and storing it as the active transaction so
 * that the existing invoker/DC API flow can continue as it already does.
 */
export const DcApiTransactionResolver: ResolveFn<ActiveTransaction> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<ActiveTransaction> => {
    const verifierEndpointService = inject(VerifierEndpointService);
    const transactionId: string = route.params['transactionId'];

    return verifierEndpointService.getDcApiTransaction(transactionId);
  };

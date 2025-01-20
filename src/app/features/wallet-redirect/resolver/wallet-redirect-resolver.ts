import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {map} from "rxjs/operators";
import {WalletResponse} from "@core/models/WalletResponse";
import {LocalStorageService} from "@core/services/local-storage.service";
import * as constants from "@core/constants/general";
import {ACTIVE_TRANSACTION} from "@core/constants/general";
import {ActiveTransaction} from "@core/models/ActiveTransaction";

export const WalletRedirectResolver: ResolveFn<ConcludedTransaction> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<ConcludedTransaction> => {

    const services = {
      verifierEndpointService: inject(VerifierEndpointService),
      localStorageService: inject(LocalStorageService)
    };

    let activeTransaction: ActiveTransaction = JSON.parse(
      services.localStorageService.get(ACTIVE_TRANSACTION)!!
    );

    function concludeTransaction(walletResponse: WalletResponse): ConcludedTransaction {
      let concludedTransaction: ConcludedTransaction =  {
        transactionId: activeTransaction.initialized_transaction.transaction_id,
        presentationDefinition: activeTransaction.initialization_request.presentation_definition,
        walletResponse: walletResponse,
        nonce: activeTransaction.initialization_request.nonce
      }
      // Clear local storage
      services.localStorageService.remove(constants.ACTIVE_TRANSACTION);

      return concludedTransaction;
    }

    const responseCode: string = route.queryParams['response_code'];
    console.log(activeTransaction);
    if (activeTransaction && responseCode) {
      return services.verifierEndpointService.getWalletResponse(activeTransaction.initialized_transaction.transaction_id, responseCode)
        .pipe(
          map((walletResponse) => {
            return concludeTransaction(walletResponse)
          })
        )
    } else {
      return EMPTY;
    }
  };

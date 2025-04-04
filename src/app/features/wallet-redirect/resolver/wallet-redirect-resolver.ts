import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {InitializedTransaction} from '@core/models/InitializedTransaction';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {map} from "rxjs/operators";
import {WalletResponse} from "@core/models/WalletResponse";
import {LocalStorageService} from "@core/services/local-storage.service";
import {ACTIVE_PRESENTATION_DEFINITION, ACTIVE_TRANSACTION} from "@core/constants/general";
import {PresentationDefinition} from "@core/models/presentation/PresentationDefinition";

export const WalletRedirectResolver: ResolveFn<ConcludedTransaction> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<ConcludedTransaction> => {

    const services = {
      verifierEndpointService: inject(VerifierEndpointService),
      localStorage: inject(LocalStorageService)
    };

    let data: InitializedTransaction = JSON.parse(
      services.localStorage.get(ACTIVE_TRANSACTION)!!
    );
    let pd: PresentationDefinition = JSON.parse(
      services.localStorage.get(ACTIVE_PRESENTATION_DEFINITION)!!
    );

    function concludeTransaction(walletResponse: WalletResponse): ConcludedTransaction {
      return  {
        transactionId: data.transaction_id,
        presentationDefinition: pd,
        walletResponse: walletResponse,
      }
    }


    const responseCode: string = route.queryParams['response_code'];
    console.log(data);
    if (data && responseCode) {
      return services.verifierEndpointService.getWalletResponse(data.transaction_id, responseCode)
        .pipe(
          map((walletResponse) => {
            return concludeTransaction(walletResponse)
          })
        )
    } else {
      return EMPTY;
    }
  };

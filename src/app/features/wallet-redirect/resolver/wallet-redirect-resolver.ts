import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { Observable, forkJoin, EMPTY } from 'rxjs';
import * as constants from '@core/constants/constants';
import { InitializedTransaction } from '@core/models/InitializedTransaction';
import { JWTService } from '@app/core/services/jwt.service';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {WalletResponse} from "@core/models/WalletResponse";

export const WalletRedirectResolver: ResolveFn<WalletResponse> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot):
    Observable<WalletResponse> => {
    	const services = {
    		verifierEndpointService: inject(VerifierEndpointService),
    		localStorage: inject(LocalStorageService),
    		jWT: inject(JWTService),
    	};

    	let data: InitializedTransaction;
    	const stData: string | null = services.localStorage.get(constants.UI_PRESENTATION);
    	const responseCode: string = route.queryParams['response_code'];
    	if (stData && responseCode) {
    		data = JSON.parse( stData );
    		return services.verifierEndpointService.getWalletResponse(data.transaction_id, responseCode)
    	} else {
    		return EMPTY;
    	}
    };

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import * as constants from '@core/constants/constants';
import { PresentationDefinitionResponse } from '@app/core/models/presentation-definition-response';
import { WalletResponse } from '@app/features/verifiable-credential/models/WalletResponse';
import { JWTService } from '@app/core/services/jwt.service';
import { CborDecodeService } from '@app/core/services/cbor/cbor-decode.service';

// @Injectable({
// 	providedIn: 'root'
// })
// export class WalletRedirectResolverService implements Resolve<any> {

// 	// constructor () { }
// 	resolve (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
// 		 return of({});
// 	}
// }
export const WalletRedirectResolver: ResolveFn<any> =
    (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> => {
    	const services = {
    		definition: inject(PresentationDefinitionService),
    		localStorage: inject(LocalStorageService),
    		cborDecode: inject(CborDecodeService),
    		jWT: inject(JWTService),
    	};

    	let data: PresentationDefinitionResponse;
    	const stData: string | null = services.localStorage.get(constants.UI_PRESENTATION);

    	if (stData) {
    		data = JSON.parse( stData );
    		console.log('localStorageService: ', data);
    		return services.definition.getWalletResponse(data.presentation_id, 'nonce')
    			.pipe(
    				switchMap((res: WalletResponse) => {
    					return forkJoin({
    						vpToken: res.vp_token ? services.cborDecode.decode(res.vp_token) : of([]),
    						idToken: res.id_token ? services.jWT.decode(res.id_token) : of([]),
    					}).pipe(
    						take(1)
    					);
    				}),
    			);
    	} else {
    		return of([]);
    	}
    };

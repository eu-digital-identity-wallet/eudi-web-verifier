import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {WalletRedirectResolver} from '@features/wallet-redirect/resolver/wallet-redirect-resolver';
import {NavigateService} from '@core/services/navigate.service';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";

const routes: Routes = [
	{ path: '',
    redirectTo: 'home',
    pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('@features/presentation-request-preparation/home/home.component')
      .then(c => c.HomeComponent) },
	{ path: 'custom-request',
    loadChildren: () => import('@features/custom-presentation-request/custom-presentation-request.module').
      then(m => m.CustomPresentationRequestModule )},
  { path: 'invoke-wallet',
    loadChildren: () => import('@features/invoke-wallet/invoke-wallet.module')
      .then(m => m.InvokeWalletModule) },
	{ path: 'get-wallet-code',
		loadComponent: () => import('./features/wallet-redirect/wallet-redirect.component')
      .then(c => c.WalletRedirectComponent),
		providers: [VerifierEndpointService, NavigateService],
		resolve: {
			data: WalletRedirectResolver
		}
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }

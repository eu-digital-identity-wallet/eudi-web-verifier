import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WalletRedirectResolver } from '@features/wallet-redirect/resolver/wallet-redirect-resolver';
import { NavigateService } from '@core/services/navigate.service';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { WalletRedirectComponent } from './features/wallet-redirect/wallet-redirect.component';
import { DcApiRedirectComponent } from '@features/dc-api-redirect/dc-api-redirect.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import(
        '@features/presentation-request-preparation/home/home.component'
      ).then((c) => c.HomeComponent),
  },
  {
    path: 'custom-request',
    loadChildren: () =>
      import(
        '@features/custom-presentation-request/custom-presentation-request.module'
      ).then((m) => m.CustomPresentationRequestModule),
  },
  {
    path: 'invoke-wallet',
    loadChildren: () =>
      import('@features/invoke-wallet/invoke-wallet.module').then(
        (m) => m.InvokeWalletModule
      ),
  },
  {
    // Direct-link only entry point: initializes the DC API flow for a
    // transaction id received from the URL by fetching its DC API request
    // from the backend before allowing the user to enter the existing invoke-wallet flow.
    path: 'dc-api-init/:transactionId',
    component: DcApiRedirectComponent,
    providers: [VerifierEndpointService, NavigateService],
  },
  {
    path: 'get-wallet-code',
    component: WalletRedirectComponent,
    providers: [VerifierEndpointService, NavigateService],
    resolve: {
      data: WalletRedirectResolver,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      paramsInheritanceStrategy: 'always',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {InvokeWalletRoutingModule} from "@features/invoke-wallet/invoke-wallet-routing.module";
import {SharedModule} from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    WalletLayoutComponent,
    InvokeWalletRoutingModule,
    SharedModule
  ]
})
export class PresentationRequestPreparationModule {}

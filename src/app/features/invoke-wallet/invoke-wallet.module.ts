import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvokeWalletRoutingModule } from './invoke-wallet-routing.module';
import { HomeComponent } from './home/home.component';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SharedModule } from '@app/shared/shared.module';
import {JWTService} from "@core/services/jwt.service";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		WalletLayoutComponent,
		InvokeWalletRoutingModule,
		SharedModule
	],
  providers: [VerifierEndpointService, JWTService]
})
export class InvokeWalletModule { }

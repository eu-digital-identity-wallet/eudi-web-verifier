import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from '@features/custom-presentation-request/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import {CustomPresentationRequestRoutingModule} from "@features/custom-presentation-request/custom-presentation-request-routing.module";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";


@NgModule({
	declarations: [
		HomeComponent
	],
	providers: [
		VerifierEndpointService
	],
	imports: [
		CommonModule,
		WalletLayoutComponent,
    CustomPresentationRequestRoutingModule,
		SharedModule,
		MatIconModule
	]
})
export class CustomPresentationRequestModule { }

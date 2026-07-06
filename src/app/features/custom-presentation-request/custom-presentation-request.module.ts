import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from '@features/custom-presentation-request/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
		FormsModule,
		WalletLayoutComponent,
    	CustomPresentationRequestRoutingModule,
		SharedModule,
		MatIconModule,
		MatCardModule,
		MatButtonToggleModule
	]
})
export class CustomPresentationRequestModule { }

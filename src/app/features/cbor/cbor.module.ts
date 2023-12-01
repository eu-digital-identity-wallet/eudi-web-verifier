import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CborRoutingModule } from './cbor-routing.module';
import { HomeComponent } from './home/home.component';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		WalletLayoutComponent,
		CborRoutingModule,
		SharedModule
	]
})
export class CborModule { }

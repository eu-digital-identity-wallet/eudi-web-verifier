import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SIOPRoutingModule } from './siop-routing.module';
import { HomeComponent } from './components/home/home.component';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		SIOPRoutingModule,
		WalletLayoutComponent,
		SharedModule
	]
})
export class SIOPModule { }

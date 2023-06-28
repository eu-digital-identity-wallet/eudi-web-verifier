import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SIOPRoutingModule } from './siop-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from '@app/core/layout/layout/layout.component';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		SIOPRoutingModule,
		LayoutComponent
	]
})
export class SIOPModule { }

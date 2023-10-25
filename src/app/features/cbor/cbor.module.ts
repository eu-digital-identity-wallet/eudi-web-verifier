import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CborRoutingModule } from './cbor-routing.module';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from '@app/core/layout/layout/layout.component';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		LayoutComponent,
		CborRoutingModule
	]
})
export class CborModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '@app/shared/shared.module';
import { RadioGroupComponent } from '@app/shared/elements/radio-group/radio-group.component';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		RadioGroupComponent,
		CommonModule,
		SharedModule,
		HomeRoutingModule
	]
})
export class HomeModule { }

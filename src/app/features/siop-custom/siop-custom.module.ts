import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { SiopCustomRoutingModule } from './siop-custom-routing.module';
import { LayoutComponent } from '@app/core/layout/layout/layout.component';
import { CreateAScenarioComponent } from './components/create-a-scenario/create-a-scenario.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
	declarations: [
		CreateAScenarioComponent,
		HomeComponent
	],
	imports: [
		CommonModule,
		SiopCustomRoutingModule,
		LayoutComponent,
		ReactiveFormsModule,
		FormsModule,
		MatExpansionModule,
		SharedModule,
		MatCheckboxModule,
	]
})
export class SiopCustomModule { }

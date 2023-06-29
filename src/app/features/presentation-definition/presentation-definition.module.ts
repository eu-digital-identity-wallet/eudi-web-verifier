import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentationDefinitionRoutingModule } from './presentation-definition-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PresentationDefinitionService } from '../../core/services/presentation-definition.service';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
	declarations: [
		HomeComponent
	],
	providers: [
		PresentationDefinitionService
	],
	imports: [
		CommonModule,
		PresentationDefinitionRoutingModule,
		SharedModule,
		MatIconModule
	]
})
export class PresentationDefinitionModule { }

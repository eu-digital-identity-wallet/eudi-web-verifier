import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentationDefinitionRoutingModule } from './presentation-definition-routing.module';
import { HomeComponent } from './components/home/home.component';
import { VerifiableCredentialComponent } from './components/verifiable-credential/verifiable-credential.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PresentationDefinitionService } from './services/presentation-definition.service';


@NgModule({
	declarations: [
		HomeComponent,
		VerifiableCredentialComponent
	],
	providers: [
		PresentationDefinitionService
	],
	imports: [
		CommonModule,
		PresentationDefinitionRoutingModule,
		SharedModule
	]
})
export class PresentationDefinitionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentationDefinitionRoutingModule } from './presentation-definition-routing.module';
import { HomeComponent } from './components/home/home.component';
import { PresentationRequestComponent } from './components/presentation-request/presentation-request.component';
import { VerifiableCredentialComponent } from './components/verifiable-credential/verifiable-credential.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
	declarations: [
		HomeComponent,
		PresentationRequestComponent,
		VerifiableCredentialComponent
	],
	imports: [
		CommonModule,
		PresentationDefinitionRoutingModule,
		ReactiveFormsModule,
		SharedModule
	]
})
export class PresentationDefinitionModule { }

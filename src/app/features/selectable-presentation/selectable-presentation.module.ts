import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { SiopCustomRoutingModule } from './selectable-presentation-routing.module';
import { SelectablePresentationFormComponent } from '@features/selectable-presentation/components/selectable-presentation-form/selectable-presentation-form.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '@app/shared/shared.module';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { SelectableFormNextAction } from './services/selectable-form-next-action.service';


@NgModule({
	declarations: [
		SelectablePresentationFormComponent,
		HomeComponent
	],
	imports: [
		CommonModule,
		SiopCustomRoutingModule,
		WalletLayoutComponent,
		ReactiveFormsModule,
		FormsModule,
		MatExpansionModule,
		SharedModule,
		MatCheckboxModule,
	],
	providers: [
		SelectableFormNextAction
	]
})
export class SelectablePresentationModule { }

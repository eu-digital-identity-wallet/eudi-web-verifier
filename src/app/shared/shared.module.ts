import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './elements/editor/editor.component';
import { ButtonComponent } from './elements/button/button.component';
import { BodyActionsComponent } from './elements/body-actions/body-actions.component';
import { OrderByPipe } from './elements/pipes/order-by.pipe';
import { BodyActionsService } from './elements/body-actions/body-actions.service';

@NgModule({
	declarations: [
		EditorComponent,
		ButtonComponent,
		BodyActionsComponent,
		OrderByPipe
	],
	imports: [
		CommonModule
	],
	exports: [
		EditorComponent,
		ButtonComponent,
		BodyActionsComponent,
		OrderByPipe
	],
	providers: [
		BodyActionsService
	]
})
export class SharedModule { }

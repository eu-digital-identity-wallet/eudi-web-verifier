import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './elements/editor/editor.component';
import { ButtonComponent } from './elements/button/button.component';
import { BodyActionsComponent } from './elements/body-actions/body-actions.component';
import { OrderByPipe } from './elements/pipes/order-by.pipe';

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
	]
})
export class SharedModule { }

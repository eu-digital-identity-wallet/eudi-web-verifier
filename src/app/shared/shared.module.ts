import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './elements/editor/editor.component';
import { ButtonComponent } from './elements/button/button.component';

@NgModule({
	declarations: [
		EditorComponent,
		ButtonComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		EditorComponent,
		ButtonComponent
	]
})
export class SharedModule { }

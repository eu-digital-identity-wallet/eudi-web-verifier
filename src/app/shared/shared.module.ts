import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './elements/editor/editor.component';
import { ButtonComponent } from './elements/button/button.component';
import { FormsModule } from '@angular/forms';


@NgModule({
	declarations: [
		EditorComponent,
		ButtonComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		EditorComponent,
		ButtonComponent
	]
})
export class SharedModule { }

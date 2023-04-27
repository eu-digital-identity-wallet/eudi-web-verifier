import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CodeEditorMode } from './CodeEditorMode';
import { json } from '@codemirror/lang-json';
import { basicSetup, EditorView } from 'codemirror';
import { Compartment } from '@codemirror/state';
import { oneDarkTheme } from '@codemirror/theme-one-dark';

@Component({
	selector: 'vc-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('editorHolder', { static: true })	editorHolder: any;

  @Input()	mode: CodeEditorMode = 'json';

  @Input()	readonly = false;

  @Input()	code: string | undefined;

  @Output() request: EventEmitter<string> = new EventEmitter();

  editorTheme = new Compartment();

  // code: string | undefined;

  codeMirrorInstance: any;

  ngAfterViewInit (): void {
  	this.codeMirrorInstance = new EditorView({
  		doc: this.code ? this.code : '',
  		extensions: [
  			EditorView.updateListener.of((v) => {this.onChange(v); }),
  			basicSetup,
  			json(),
  			// lineNumbers(),
  			// foldGutter({
  			// 	closedText: '›',
  			// 	openText: '⌄'
  			// }),
  			this.editorTheme.of(oneDarkTheme),
  		],
  		parent: this.editorHolder.nativeElement
  	});
  }

  onChange (v: any) {
  	if (v.docChanged) {
  		this.request.emit(this.codeMirrorInstance.state.doc.toString());
  	}
  }

}

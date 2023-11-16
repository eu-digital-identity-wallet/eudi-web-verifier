import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorMode } from './CodeEditorMode';
import { json } from '@codemirror/lang-json';
import { basicSetup, EditorView } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import {
	defaultHighlightStyle,
	syntaxHighlighting
} from '@codemirror/language';

@Component({
	selector: 'vc-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('editorHolder', { static: true })	editorHolder!: ElementRef;

  @Input()	mode: CodeEditorMode = 'json';

  // @Input()	code: string | undefined = '';

  @Input() set code (value: string | undefined) {
  	if (value) {
  		this.inputCode = JSON.stringify(value, null, '\t');
  	}
  }

  @Input()	editable = true;

  @Output() request: EventEmitter<string> = new EventEmitter();

  inputCode = '';
  editorTheme = new Compartment();

  codeMirrorInstance!: EditorView;

  ngAfterViewInit (): void {
  	this.codeMirrorInstance = new EditorView({
  		doc: this.inputCode,
  		extensions: [
  			EditorState.readOnly.of(this.editable),
  			EditorView.updateListener.of((v) => {this.onChange(v); }),
  			basicSetup,
  			json(),
  			syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
  			this.editorTheme.of(oneDarkTheme),
  		],
  		parent: this.editorHolder.nativeElement
  	});
  }

  onChange (v: {docChanged:boolean}) {
  	if (v.docChanged) {
  		this.request.emit(this.codeMirrorInstance.state.doc.toString());
  	}
  }

}

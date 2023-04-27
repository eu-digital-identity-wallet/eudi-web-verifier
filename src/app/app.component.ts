import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
	selector: 'vc-root',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	ngOnInit (): void {
		console.log('apiUrl', environment.apiUrl);
	}
	title = 'verifier-ui';
}

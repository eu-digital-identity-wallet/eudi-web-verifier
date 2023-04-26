import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
	selector: 'vc-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	ngOnInit (): void {
		console.log('env', environment.apiUrl);
	}
	title = 'verifier-ui';
}

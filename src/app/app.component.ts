import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
	selector: 'vc-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	ngOnInit (): void {
		console.log('env', environment.apiUrl);
	}
	title = 'verifier-ui';
}

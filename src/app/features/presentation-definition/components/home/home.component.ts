import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	requestCode = null;

	requestedCode (code: any) {
		this.requestCode = code;
	}
	generateCode () {
		console.log('code', this.requestCode);
	}
}

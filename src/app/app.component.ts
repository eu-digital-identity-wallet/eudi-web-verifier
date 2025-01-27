import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'vc-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent {
	title = 'verifier-ui';
}

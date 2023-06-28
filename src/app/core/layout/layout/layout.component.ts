import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigateService } from '@app/core/services/navigate.service';
@Component({
	selector: 'vc-layout',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
	constructor (
    private readonly navigateService: NavigateService,
	) {}

	goBack () {
		this.navigateService.goBack();
	}
}

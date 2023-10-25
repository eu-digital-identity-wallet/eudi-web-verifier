import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigateService } from '@app/core/services/navigate.service';
import { Router } from '@angular/router';
@Component({
	selector: 'vc-layout',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	constructor (
    private readonly router: Router,
    private readonly navigateService: NavigateService,
	) {}
	showBackButton = true;
	ngOnInit (): void {
		if (this.router.url.includes('home')) {
			this.showBackButton = false;
		}
	}

	goBack () {
		this.navigateService.goBack();
	}
}

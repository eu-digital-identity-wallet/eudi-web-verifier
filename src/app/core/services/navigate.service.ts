import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RequestType } from '../constants/wallet-data';

@Injectable({
	providedIn: 'root'
})
export class NavigateService {

	constructor(
		private readonly router: Router,
		private readonly location: Location
	) { }

	goHome() {
		this.navigateTo('home');
	}
	goBack() {
		this.location.back();
	}
	navigateTo(path: string, requestType: RequestType | null = null): Promise<boolean> {
		if (requestType) {
			return this.router.navigate([path, { requestType: requestType }]);
		} else {
			return this.router.navigate([path]);
		}

	}
}

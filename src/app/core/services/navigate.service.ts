import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class NavigateService {

	constructor (
    private readonly router: Router,
    private readonly location: Location
	) {}

	goHome () {
		this.navigateTo('home');
	}
	goBack () {
		this.location.back();
	}
	navigateTo (path: string): Promise<boolean> {
		return this.router.navigate([path]);
	}
}

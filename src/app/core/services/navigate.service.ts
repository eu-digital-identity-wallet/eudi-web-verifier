import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class NavigateService {

	constructor (
    private readonly router: Router
	) {}

	navigateTo (path: string) {
		this.router.navigate([path]).then(
			(d) => {
				console.log('done: ', d);
			}
		);
	}
}

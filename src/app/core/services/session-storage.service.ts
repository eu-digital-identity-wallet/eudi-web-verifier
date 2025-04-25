import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SessionStorageService {

	get (key: string): string | null {
		return sessionStorage.getItem(key);
	}
	set (key: string, value: string): void {
		sessionStorage.setItem(key,value);
	}
	remove (key: string) {
		sessionStorage.removeItem(key);
	}
}

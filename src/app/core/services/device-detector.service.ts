import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class DeviceDetectorService {
	userAgent = '';

	constructor (@Inject(PLATFORM_ID) private platformId: object) {
		if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
			this.userAgent = window.navigator.userAgent;
		}
	}

	public isMobile (userAgent = this.userAgent): boolean {
		const regexs = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i];
		return regexs.some((b) => userAgent.match(b));
	}

	public isTablet (userAgent = this.userAgent): boolean {
	  const regex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
		return regex.test(userAgent.toLowerCase());
	}

	isDesktop = (): boolean => !this.isMobile() && !this.isMobile();
}

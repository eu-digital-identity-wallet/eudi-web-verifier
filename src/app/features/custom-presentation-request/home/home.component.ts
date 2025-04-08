import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { InitializedTransaction } from '@core/models/InitializedTransaction';
import { DataService } from '@core/services/data.service';
import { NavigateService } from '@core/services/navigate.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BodyAction } from '@shared/elements/body-actions/models/BodyAction';
import { PRESENTATION_ACTIONS } from '@core/constants/pages-actions';
import { ActionCode } from '@shared/elements/body-actions/models/ActionCode';
import { VerifierEndpointService } from '@core/services/verifier-endpoint.service';
import { TransactionInitializationRequest } from '@core/models/TransactionInitializationRequest';
import * as walletData from 'src/app/core/constants/wallet-data'
import {LocalStorageService} from "@core/services/local-storage.service";
import {REGISTRATION_DATA} from "@core/constants/general";

@Component({
	selector: 'vc-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

	destroy$ = new Subject();
	actions: BodyAction[] = PRESENTATION_ACTIONS;
	requestType: walletData.RequestType | null = null;
	requestCode: TransactionInitializationRequest | null = null;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly dataService: DataService,
		private readonly navigateService: NavigateService,
		private readonly verifierEndpointService: VerifierEndpointService,
		private readonly localStorageService: LocalStorageService,
	) {
		this.requestType = this.route.snapshot.params['type'];
	}

	ngOnDestroy(): void {
		this.destroy$.next('');
		this.destroy$.complete();
	}

	ngOnInit(): void {
		if (this.requestType) {
			this.requestCode = walletData[this.requestType];
		}
		// this.dataService.presentationDefinitionRequest$.subscribe((code) => {
		//   this.requestCode = code;
		//   this.disableNextButton(code);
		// });
		// this.router.events
		//   .pipe(
		//     takeUntil(this.destroy$),
		//     filter((event): event is NavigationEnd => event instanceof NavigationEnd)
		//   )
		//   .subscribe((event) => {
		// if (event.url.includes('custom-request/create')) {
		this.actions = PRESENTATION_ACTIONS;

		this.initializePresentationTransaction();
		// this.disableNextButton(this.requestCode);
		// this.changeDetectorRef.detectChanges();
		// }
		// });
	}

	runActions(data: BodyAction) {
		if (data.code === ActionCode.BACK) {
			this.navigateService.goBack();
		} else if (data.code === ActionCode.NEXT) {
			this.initializePresentationTransaction();
		}
	}

	initializePresentationTransaction() {
		if (this.requestCode) {
			const request = this.requestCode;
      const registrationData = JSON.parse(this.localStorageService.get(REGISTRATION_DATA)!!)
			this.verifierEndpointService.initializeTransaction(request, (data) => {
        this.hideNextStep();
				this.navigateService.navigateTo('/custom-request/invoke', this.requestType);
				this.changeDetectorRef.detectChanges();
			},
      registrationData,);
		} else {
			console.error('invalid JSON format');
		}
	}

	private disableNextButton(code: string) {
		[...this.actions].map((item: BodyAction) => {
			if (code && item.code == ActionCode.NEXT) {
				item.disabled = false;
			} else if (item.code == ActionCode.NEXT) {
				item.disabled = true;
			}
			return item;
		});
	}

	private hideNextStep() {
		this.actions = this.actions.filter((item: BodyAction) => item.code !== ActionCode.NEXT);
	}
}

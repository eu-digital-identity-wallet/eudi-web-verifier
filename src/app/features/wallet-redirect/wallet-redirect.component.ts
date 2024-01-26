import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { TransformedResponse } from '../verifiable-credential/models/TransformedResponse';
import { PresentationsResultsComponent } from '../verifiable-credential/components/presentations-results/presentations-results.component';

@Component({
	selector: 'vc-wallet-redirect',
	standalone: true,
	imports: [CommonModule, WalletLayoutComponent, PresentationsResultsComponent],
	templateUrl: './wallet-redirect.component.html',
	styleUrls: ['./wallet-redirect.component.scss']
})
export class WalletRedirectComponent implements OnInit {
	data!: TransformedResponse;
	constructor (
    private readonly activeRoute: ActivatedRoute
	) {}
	ngOnInit (): void {
		this.data = this.activeRoute.snapshot.data['data'];
	}

}

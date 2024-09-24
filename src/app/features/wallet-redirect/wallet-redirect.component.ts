import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';
import { PresentationsResultsComponent } from '@features/invoke-wallet/components/presentations-results/presentations-results.component';
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";

@Component({
	selector: 'vc-wallet-redirect',
	standalone: true,
	imports: [CommonModule, WalletLayoutComponent, PresentationsResultsComponent],
	templateUrl: './wallet-redirect.component.html',
	styleUrls: ['./wallet-redirect.component.scss']
})
export class WalletRedirectComponent implements OnInit {
	data!: ConcludedTransaction;
	constructor (
    private readonly activeRoute: ActivatedRoute
	) {}
	ngOnInit (): void {
		this.data = this.activeRoute.snapshot.data['data'];
	}

}

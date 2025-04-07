import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletLayoutHeaderComponent } from './wallet-layout-header/wallet-layout-header.component';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'vc-wallet-layout',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, WalletLayoutHeaderComponent],
	templateUrl: './wallet-layout.component.html',
	styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent {

}

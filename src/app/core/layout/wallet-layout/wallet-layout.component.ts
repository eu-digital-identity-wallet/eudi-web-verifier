import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletLayoutHeaderComponent } from './wallet-layout-header/wallet-layout-header.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'vc-wallet-layout',
    imports: [CommonModule, WalletLayoutHeaderComponent],
    templateUrl: './wallet-layout.component.html',
    styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent {
    environment = environment;
}

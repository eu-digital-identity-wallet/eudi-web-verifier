import {Component, inject} from '@angular/core';
import { NavigateService } from '@app/core/services/navigate.service';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from '@angular/material/toolbar';
import { OpenLogsComponent } from "@shared/elements/open-logs/open-logs.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {InputSchemeComponent} from "@shared/elements/input-scheme/input-scheme.component";
import { IssuerChainComponent } from '@app/shared/elements/trusted-issuer/issuer-chain.component';

@Component({
    selector: 'vc-wallet-layout-header',
    templateUrl: './wallet-layout-header.component.html',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatDialogModule
    ],
    styleUrls: ['./wallet-layout-header.component.scss']
})
export class WalletLayoutHeaderComponent {
	constructor (private readonly navigateService: NavigateService) {}

  private readonly dialog: MatDialog = inject(MatDialog);

	goHome () {
		this.navigateService.goHome();
	}

  inspectLogs () {
    this.dialog.open(OpenLogsComponent, {
      data: {
        transactionId: '',
        label: 'Inspect transaction logs',
        isInspectLogs: true
      },
    });
  }

  changeCustomScheme () {
    this.dialog.open(InputSchemeComponent, {
      data: {
        transactionId: '',
        label: 'Inspect transaction logs',
        isInspectLogs: true
      },
    });
  }

  changeIssuerChain () {
    this.dialog.open(IssuerChainComponent, {
      data: {
      },
      height: '70%',
      width: '80%',
    });
  }
}

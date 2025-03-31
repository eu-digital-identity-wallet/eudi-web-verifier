import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {SharedModule} from "@shared/shared.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {ViewAttestationComponent} from "@features/invoke-wallet/components/view-attestation/view-attestation.component";
import {Errored, PresentedAttestation, Single} from "@core/models/presentation/PresentedAttestation";
import {WalletResponseProcessorService} from "@features/invoke-wallet/services/wallet-response-processor.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OpenLogsComponent} from "@shared/elements/open-logs/open-logs.component";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import { PresentationQuery } from '@app/core/models/TransactionInitializationRequest';

@Component({
    selector: 'vc-presentations-results',
    imports: [
        CommonModule,
        MatListModule,
        SharedModule,
        MatExpansionModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: [WalletResponseProcessorService],
    templateUrl: './presentations-results.component.html',
    styleUrls: ['./presentations-results.component.scss']
})
export class PresentationsResultsComponent implements OnInit {
  constructor(
    private readonly responseProcessor: WalletResponseProcessorService
  ) {
  }

  @Input() concludedTransaction!: ConcludedTransaction;
  presentationQuery!: PresentationQuery;
  attestations$: Observable<(Single | Errored)[]> = of([]);
  readonly dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this.presentationQuery = this.concludedTransaction.presentationQuery;
    this.attestations$ = this.responseProcessor.mapVpTokenToAttestations(this.concludedTransaction)
        .pipe(
          map((attestations) => {
            return this.flatten(attestations)
          })
        );
  }

  flatten(sharedAttestations: PresentedAttestation[]): (Single | Errored)[] {
    let singles: (Single | Errored)[] = []
    sharedAttestations.forEach(it => {
      switch (it.kind) {
        case "enveloped":
          return singles.push(...it.attestations)
        case "single":
          return singles.push(it)
        case "error":
          return singles.push(it)
      }
    })
    return singles
  }

  isErrored(it: Single | Errored): it is Errored {
    return it.kind === 'error' as const
  }

  viewContents(attestation: Single) {
    this.dialog.open(ViewAttestationComponent, {
      data: {
        attestation: attestation
      },
      height: '70%',
      width: '60%',
    });
  }

  openLogs() {
    this.dialog.open(OpenLogsComponent, {
      data: {
        transactionId: this.concludedTransaction.transactionId,
        label: 'Show Logs',
        isInspectLogs: false
      },
    });
  }
}

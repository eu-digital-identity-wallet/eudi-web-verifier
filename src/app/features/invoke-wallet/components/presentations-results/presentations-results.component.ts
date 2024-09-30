import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {SharedModule} from "@shared/shared.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {PresentationDefinition} from "@core/models/presentation/PresentationDefinition";
import {ViewAttestationComponent} from "@features/invoke-wallet/components/view-attestation/view-attestation.component";
import {SharedAttestation, Single} from "@core/models/presentation/SharedAttestation";
import {WalletResponseProcessorService} from "@features/invoke-wallet/services/wallet-response-processor.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'vc-presentations-results',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    SharedModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    ViewAttestationComponent
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
  presentationRequest!: PresentationDefinition;
  attestations!: Single[];
  readonly dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    console.log('Presentation results init with ')
    console.log(this.concludedTransaction)

    this.presentationRequest = this.concludedTransaction.presentationDefinition;
    let sharedAttestations: SharedAttestation[] = this.responseProcessor.mapVpTokenToAttestations(this.concludedTransaction);
    this.attestations = this.flatten(sharedAttestations)
  }

  flatten(sharedAttestations: SharedAttestation[]): Single[] {
    let singles: Single[] = []
    sharedAttestations.forEach(it => {
      switch (it.kind) {
        case "enveloped":
          return singles.push(...it.attestations)
        case "single":
          return singles.push(it)
      }
    })
    return singles
  }

  viewContents(attestation: Single) {
    this.dialog.open(ViewAttestationComponent, {
      data: {
        attestation: attestation
      },
      height: '40%',
      width: '60%',
    });
  }
}

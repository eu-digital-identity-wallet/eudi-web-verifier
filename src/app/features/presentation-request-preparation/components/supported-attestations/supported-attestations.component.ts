import {CommonModule} from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatRadioModule} from "@angular/material/radio";
import {AttestationSelectionComponent} from "@features/presentation-request-preparation/components/attestation-selection/attestation-selection.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationSelection} from "@features/presentation-request-preparation/models/AttestationSelection";
import {AttestationDefinition} from "@core/models/attestation/AttestationDefinition";
import {SUPPORTED_ATTESTATIONS} from "@core/constants/attestation-definitions";

@Component({
  selector: 'vc-supported-attestations',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    WalletLayoutComponent,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    AttestationSelectionComponent,
    MatExpansionModule,
  ],
  templateUrl: './supported-attestations.component.html',
  styleUrls: ['./supported-attestations.component.css']
})
export class SupportedAttestationsComponent implements OnInit {

  @Output() selectionChangedEvent = new EventEmitter<AttestationSelection[]>();

  attestations: AttestationDefinition[] = []
  attestationSelections: {[id: string]: AttestationSelection} = {};

  ngOnInit(): void {
    Object.keys(SUPPORTED_ATTESTATIONS).forEach((item) => {
      this.attestations.push(SUPPORTED_ATTESTATIONS[item]);
    });
  }

  handleAttestationSelectionEvent($event: AttestationSelection) {
    if ($event.format != null && $event.attributeSelectionMethod != null) {
      if (this.newSelectionOrAttestationSelectionChanged($event)) {
        this.attestationSelections[$event.type as string] = $event;
        this.selectionChangedEvent.emit( this.constructAttestationsSelectionEventPayload() )
      }
    } else {
      delete this.attestationSelections[$event.type as string];
      this.selectionChangedEvent.emit( this.constructAttestationsSelectionEventPayload() )
    }
  }

  newSelectionOrAttestationSelectionChanged($event: AttestationSelection): boolean {
    let attestationSelection = this.attestationSelections[$event.type as string];
    return !attestationSelection || (attestationSelection &&
      (attestationSelection.format != $event.format ||
        attestationSelection.attributeSelectionMethod != $event.attributeSelectionMethod))
  }

  constructAttestationsSelectionEventPayload(): AttestationSelection[] {
    let selections: AttestationSelection[] = [];
    Object.keys(this.attestationSelections).forEach((item ) => {
      selections.push(this.attestationSelections[item])
    })
    return  selections
  }

}

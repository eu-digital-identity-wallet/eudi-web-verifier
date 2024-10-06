import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {AttestationSelection, ScenarioSelection} from "@features/presentation-request-preparation/models/ScenarioSelection";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {SUPPORTED_ATTESTATIONS} from "@core/constants/attestations-supported";
import {AttributeSelectionMethod} from "@features/presentation-request-preparation/models/ScenarioAttestation";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'vc-attribute-selection',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    WalletLayoutComponent,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './attribute-selection.component.html'
})
export class AttributeSelectionComponent {

  @Input() scenarioSelection!: ScenarioSelection;

  nameOf(attestationType: AttestationType) {
    return SUPPORTED_ATTESTATIONS[attestationType as string].name;
  }

  isSelectable(selection: AttestationSelection) {
    return selection.attributeSelectionMethod == AttributeSelectionMethod.SELECTABLE;
  }

  popAttributesSelector() {

  }
}

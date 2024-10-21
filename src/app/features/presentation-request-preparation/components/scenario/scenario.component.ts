import {CommonModule} from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {PresentationScenario} from "@features/presentation-request-preparation/models/PresentationScenario";
import {PRESENTATION_SCENARIOS} from "@core/constants/presentation-scenarios";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatRadioModule} from "@angular/material/radio";
import {AttestationComponent} from "@features/presentation-request-preparation/components/attestation/attestation.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationSelection, ScenarioSelection} from "@features/presentation-request-preparation/models/ScenarioSelection";

@Component({
  selector: 'vc-presentation-scenario',
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
    AttestationComponent,
    MatExpansionModule,
  ],
  templateUrl: './scenario.component.html'
})
export class ScenarioComponent implements OnInit {

  @Output() selectionChangedEvent = new EventEmitter<ScenarioSelection>();

  scenarios!: PresentationScenario[];
  selectedScenario: PresentationScenario | null = null;
  attestationSelections: {[id: string]: AttestationSelection} = {};

  scenarioFormControl =
    new FormControl('', Validators.required);

  ngOnInit(): void {
    this.scenarios = Object.assign([], PRESENTATION_SCENARIOS);
  }

  handleAttestationSelectionEvent($event: AttestationSelection) {
    if ($event.format != null && $event.attributeSelectionMethod != null) {
      if (this.newSelectionOrAttestationSelectionChanged($event)) {
        this.attestationSelections[$event.type as string] = $event;
        this.selectionChangedEvent.emit( this.constructScenarioSelection() )
      }
    } else {
      delete this.attestationSelections[$event.type as string];
      this.selectionChangedEvent.emit( this.constructScenarioSelection() )
    }
  }

  newSelectionOrAttestationSelectionChanged($event: AttestationSelection): boolean {
    let attestationSelection = this.attestationSelections[$event.type as string];
    return !attestationSelection || (attestationSelection &&
      (attestationSelection.format != $event.format ||
        attestationSelection.attributeSelectionMethod != $event.attributeSelectionMethod))
  }

  constructScenarioSelection(): ScenarioSelection {
    let selections: AttestationSelection[] = [];
    Object.keys(this.attestationSelections).forEach((item ) => {
      selections.push(this.attestationSelections[item])
    })
    return {
      scenarioName: this.selectedScenario!.name,
      selections: selections
    }
  }

  clearSelections() {
    this.attestationSelections = {}
    this.selectionChangedEvent.emit(
      this.constructScenarioSelection()
    )
  }
}

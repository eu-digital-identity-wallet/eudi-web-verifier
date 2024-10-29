import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule, KeyValue} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttributeSelectionMethod, ScenarioAttestation} from "@features/presentation-request-preparation/models/ScenarioAttestation";
import {SUPPORTED_ATTESTATIONS, SUPPORTED_FORMATS} from "@core/constants/attestations";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationSelection} from "@features/presentation-request-preparation/models/ScenarioSelection";
import {FormatSelectOption} from "@features/presentation-request-preparation/components/attestation/model/format-select-option";

@Component({
  selector: 'vc-scenario-attestation',
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
    MatExpansionModule,
  ],
  templateUrl: './attestation.component.html'
})
export class AttestationComponent {

  @Input() attestation!: ScenarioAttestation;
  @Output() attestationSelectionEvent = new EventEmitter<AttestationSelection>();

  protected readonly supportedFormats: FormatSelectOption[] = this.formatOptions()

  methodControl = new FormControl<AttributeSelectionMethod | null>(null, Validators.required);
  formatControl = new FormControl<AttestationFormat | null>(null, Validators.required);

  selectedMethod: AttributeSelectionMethod | null = null;
  selectedFormat: AttestationFormat | null = null;

  labelOf(method: AttributeSelectionMethod): string {
    if (method == AttributeSelectionMethod.ALL_ATTRIBUTES) {
      return "All attributes";
    } else {
      return "Specific attributes";
    }
  }

  formatOptions(): FormatSelectOption[] {
    function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
      return Object.keys(obj).filter(k => !Number.isNaN(k)) as K[]
    }

    let result: FormatSelectOption[] = [];
    for (const enumKey of enumKeys(AttestationFormat)) {
      const format = AttestationFormat[enumKey];
      result.push({
        key: format,
        value: format,
        disabled: !SUPPORTED_FORMATS.includes(format)
      })
    }
    return result
  }

  emit() {
    this.attestationSelectionEvent.emit({
      type: this.attestation.attestationType,
      format: this.selectedFormat,
      attributeSelectionMethod: this.selectedMethod
    });
  }

  nameOf(attestation: ScenarioAttestation): string {
    return SUPPORTED_ATTESTATIONS[attestation.attestationType as string].name
  }

  protected readonly frameElement = frameElement;
}

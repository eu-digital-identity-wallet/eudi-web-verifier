import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttributeSelectionMethod} from "@features/presentation-request-preparation/models/AttestationSelection";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {AttestationSelection} from "@features/presentation-request-preparation/models/AttestationSelection";
import {FormatSelectOption} from "@features/presentation-request-preparation/components/attestation-selection/model/format-select-option";
import {AttestationDefinition} from "@core/models/attestation/AttestationDefinition";
import {SUPPORTED_FORMATS} from "@core/constants/attestations-per-format";

@Component({
  selector: 'vc-attestation-selection',
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
  templateUrl: './attestation-selection.component.html'
})
export class AttestationSelectionComponent {

  @Input() attestation!: AttestationDefinition;
  @Output() attestationSelectionEvent = new EventEmitter<AttestationSelection>();

  protected readonly supportedFormats: FormatSelectOption[] = this.formatOptions()

  attributeSelectionMethods = [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
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
      type: this.attestation.type,
      format: this.selectedFormat,
      attributeSelectionMethod: this.selectedMethod
    });
  }

}

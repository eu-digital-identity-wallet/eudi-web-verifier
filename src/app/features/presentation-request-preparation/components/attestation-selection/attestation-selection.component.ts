import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttestationSelection, AttributeSelectionMethod} from "@features/presentation-request-preparation/models/AttestationSelection";
import {MatExpansionModule} from "@angular/material/expansion";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {FormatSelectOption} from "@features/presentation-request-preparation/components/attestation-selection/model/format-select-option";
import {AttestationDefinition} from "@core/models/attestation/AttestationDefinition";
import {ATTESTATIONS_BY_FORMAT} from "@core/constants/attestations-per-format";
import {Attestation} from "@core/models/attestation/Attestations";
import {AttestationType} from "@core/models/attestation/AttestationType";

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
export class AttestationSelectionComponent implements OnInit {

  @Input() attestation!: AttestationDefinition;
  @Output() attestationSelectionEvent = new EventEmitter<AttestationSelection>();

  supportedFormats!: FormatSelectOption[];

  attributeSelectionMethods = [AttributeSelectionMethod.SELECTABLE, AttributeSelectionMethod.ALL_ATTRIBUTES]
  methodControl = new FormControl<AttributeSelectionMethod | null>(null, Validators.required);
  formatControl = new FormControl<AttestationFormat | null>(null, Validators.required);
  selectedMethod: AttributeSelectionMethod | null = null;
  selectedFormat: AttestationFormat | null = null;


  ngOnInit(): void {
    this.supportedFormats = this.formatOptions()
  }

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

    function formatSupportedForAttestation(format: AttestationFormat, type: AttestationType): boolean {
      return ATTESTATIONS_BY_FORMAT[format as string]?.filter((attestation: Attestation) =>
        attestation.attestationDef.type === type
      ).length > 0;
    }

    let result: FormatSelectOption[] = [];
    for (const enumKey of enumKeys(AttestationFormat)) {
      const format = AttestationFormat[enumKey];
      if (formatSupportedForAttestation(format, this.attestation.type)) {
        result.push({
          key: format,
          value: format,
          disabled: false
        })
      }
    }
    return result
  }

  emitAttestationSelectionChanged() {
    this.attestationSelectionEvent.emit({
      type: this.attestation.type,
      format: this.selectedFormat,
      attributeSelectionMethod: this.selectedMethod
    });
  }

}

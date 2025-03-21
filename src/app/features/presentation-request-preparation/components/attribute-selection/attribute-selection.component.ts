import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {AttestationSelection, AttributeSelectionMethod} from "@features/presentation-request-preparation/models/AttestationSelection";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {SUPPORTED_ATTESTATIONS} from "@core/constants/attestation-definitions";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {
  SelectableAttestationAttributesComponent
} from "@features/presentation-request-preparation/components/selectable-attestation-attributes/selectable-attestation-attributes.component";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {DialogResult} from "@features/presentation-request-preparation/components/selectable-attestation-attributes/model/DialogResult";
import {MatBadgeModule} from "@angular/material/badge";
import { AttributesSelectionEvent } from "../../models/AttributesSelection";

@Component({
    templateUrl: './attribute-selection.component.html',
    selector: 'vc-attribute-selection',
    imports: [
        CommonModule,
        SharedModule,
        MatButtonModule,
        MatCardModule,
        MatBadgeModule
    ],
    styleUrls: ['./attribute-selection.component.scss']
})
export class AttributeSelectionComponent implements OnChanges {

  constructor(
  ) { }

  @Input() attestationsSelection!: AttestationSelection[];
  @Output() attributesCollectedEvent = new EventEmitter<AttributesSelectionEvent>();

  readonly dialog: MatDialog = inject(MatDialog);

  selectedFieldsByType: { [id: string]: string[] } = {}

  nameOf(attestationType: AttestationType) {
    return SUPPORTED_ATTESTATIONS[attestationType as string].name;
  }

  isSelectable(selection: AttestationSelection) {
    return selection.attributeSelectionMethod == AttributeSelectionMethod.SELECTABLE;
  }

  popAttributesSelector(format: AttestationFormat, type: AttestationType, attestationName: string) {
    const dialogRef = this.dialog.open(SelectableAttestationAttributesComponent, {
      data: {
        type: type,
        format: format,
        attestationName: attestationName,
        seed: {
          selectedFields: this.selectedFieldsByType[type as string]
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // result can be null or undefined if popup is closed without saving selection (clicking on 'close' button or focus lost)
      if (result) {
        this.updateSelectionMap(result.data as DialogResult);
      }
    });
  }

  private updateSelectionMap(dialogResult: DialogResult) {
    if (dialogResult.selectedFields.length > 0) {
      this.selectedFieldsByType[dialogResult.attestationType as string] = dialogResult.selectedFields;
    } else {
      delete this.selectedFieldsByType[dialogResult.attestationType as string]
    }
    this.emitAttributesCollectedEvent();
  }

  private emitAttributesCollectedEvent() {
    let result: AttributesSelectionEvent = {
      selectedAttributes: this.selectedFieldsByType
    };
    this.attributesCollectedEvent.emit(result);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["attestationsSelection"].firstChange) {
      let currentSelection = changes["attestationsSelection"].currentValue as AttestationSelection[];
      let previousSelection = changes["attestationsSelection"].previousValue as AttestationSelection[];
      Object.keys(this.selectedFieldsByType).forEach((item) => {
        if (this.attributeSelectionChanged(currentSelection, previousSelection, item as AttestationType)) {
          delete this.selectedFieldsByType[item];
        }
      });
    }
    this.emitAttributesCollectedEvent();
  }

  fieldsSelectedNo(selection: AttestationSelection): number {
    if(!this.isSelectable(selection)) {
      return SUPPORTED_ATTESTATIONS[selection.type as string].dataSet.length;
    }

    if (this.selectedFieldsByType[selection.type as string])
      return this.selectedFieldsByType[selection.type as string].length;
    else
      return 0;
  }

  canShowFieldsSelected(type: AttestationType): boolean {
    if (this.selectedFieldsByType[type as string])
      return this.selectedFieldsByType[type as string].length > 0;
    else
      return false;
  }

  private attributeSelectionChanged(
    currentSelection: AttestationSelection[],
    previousSelection: AttestationSelection[],
    attestationType: AttestationType
  ): boolean {
    let current = currentSelection.filter((selection: AttestationSelection) =>
      selection.type === attestationType
    )
    let previous = previousSelection.filter((selection: AttestationSelection) =>
      selection.type === attestationType
    )
    // Previously existed and now removed
    if (previous && previous.length >= 1 && (!current || current.length == 0)) {
      return true
    }
    // Selection method or format changed
    if (previous && previous.length >= 1 && current && current.length >= 1) {
      return previous[0].attributeSelectionMethod != current[0].attributeSelectionMethod || previous[0].format != current[0].format;
    }
    return false;
  }
}

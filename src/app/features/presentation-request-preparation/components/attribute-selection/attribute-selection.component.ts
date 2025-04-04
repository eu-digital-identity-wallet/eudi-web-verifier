import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {AttestationSelection, AttributeSelectionMethod} from "@features/presentation-request-preparation/models/AttestationSelection";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {SUPPORTED_ATTESTATIONS} from "@core/constants/attestations";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {
  SelectableAttestationAttributesComponent
} from "@features/presentation-request-preparation/components/selectable-attestation-attributes/selectable-attestation-attributes.component";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";
import {DialogResult} from "@features/presentation-request-preparation/components/selectable-attestation-attributes/model/DialogResult";
import {MSO_MDOC_BY_TYPE} from "@core/data/MsoMdocDocuments";
import {MsoMdocPresentationService} from "@core/services/mso-mdoc-presentation.service";
import {MatBadgeModule} from "@angular/material/badge";

@Component({
  selector: 'vc-attribute-selection',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    WalletLayoutComponent,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
  ],
  providers: [MsoMdocPresentationService],
  templateUrl: './attribute-selection.component.html',
  styleUrls: ['./attribute-selection.component.scss'],
})
export class AttributeSelectionComponent implements OnInit, OnChanges {

  constructor(
    private readonly msoMdocPresentationService: MsoMdocPresentationService,
  ) { }

  @Input() attestationsSelection!: AttestationSelection[];
  @Output() attributesCollectedEvent = new EventEmitter<InputDescriptor[]>();

  readonly dialog: MatDialog = inject(MatDialog);

  inputDescriptorsByType: { [id: string]: InputDescriptor } = {}

  ngOnInit(): void {
    this.prepareDescriptorsForNonSelectable()
  }

  prepareDescriptorsForNonSelectable() {
    let allAttributesSelections = this.attestationsSelection.filter((selection: AttestationSelection) =>
      selection.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES
    )
    allAttributesSelections.forEach((selection: AttestationSelection) => {
      switch (selection.format) {
        case AttestationFormat.MSO_MDOC:
          let msoMdoc = MSO_MDOC_BY_TYPE[selection.type as string];
          let inputDescriptor = this.msoMdocPresentationService.msoMdocInputDescriptorOf(msoMdoc, "")
          this.inputDescriptorsByType[selection.type] = inputDescriptor;
          break;
        case AttestationFormat.SD_JWT_VC:
          console.error("Format " + AttestationFormat.SD_JWT_VC + " not suppoerted  yet");
          break;
        case AttestationFormat.JWT_VC_JSON:
          console.error("Format " + AttestationFormat.JWT_VC_JSON + " not suppoerted  yet");
          break;
      }
    })
  }

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
        seed: this.inputDescriptorsByType[type as string]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // result can be null or undefined if popup is closed without saving selection (clicking on 'close' button or focus lost)
      if (result) {
        this.updateInputDescriptorsDictionary(result.data as DialogResult);
      }
    });
  }

  updateInputDescriptorsDictionary(dialogResult: DialogResult) {
    if (dialogResult.inputDescriptor) {
      this.inputDescriptorsByType[dialogResult.attestationType as string] = dialogResult.inputDescriptor;
    } else {
      delete this.inputDescriptorsByType[dialogResult.attestationType as string]
    }
    this.emitAttributesCollectedEvent();
  }

  emitAttributesCollectedEvent() {
    let result: InputDescriptor[] = [];
    Object.keys(this.inputDescriptorsByType).forEach((item) => {
      result.push(this.inputDescriptorsByType[item]);
    });
    this.attributesCollectedEvent.emit(result);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["attestationsSelection"].firstChange) {
      let currentSelection = changes["attestationsSelection"].currentValue as AttestationSelection[];
      let previousSelection = changes["attestationsSelection"].previousValue as AttestationSelection[];
      Object.keys(this.inputDescriptorsByType).forEach((item) => {
        if (this.attributeSelectionChanged(currentSelection, previousSelection, item as AttestationType)) {
          delete this.inputDescriptorsByType[item];
        }
      });
    }
    this.prepareDescriptorsForNonSelectable();
    this.emitAttributesCollectedEvent();
  }

  fieldsSelectedNo(type: AttestationType): number {
    if (this.inputDescriptorsByType[type as string])
      return this.inputDescriptorsByType[type as string].constraints.fields.length;
    else
      return 0;
  }

  canShowFieldsSelected(type: AttestationType): boolean {
    if (this.inputDescriptorsByType[type as string])
      return this.inputDescriptorsByType[type as string].constraints.fields.length > 0;
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

import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {WalletLayoutComponent} from "@core/layout/wallet-layout/wallet-layout.component";
import {AttestationSelection, ScenarioSelection} from "@features/presentation-request-preparation/models/ScenarioSelection";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {SUPPORTED_ATTESTATIONS} from "@core/constants/attestations-supported";
import {AttributeSelectionMethod} from "@features/presentation-request-preparation/models/ScenarioAttestation";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {
  SelectableAttestationAttributesComponent
} from "@features/selectable-presentation/components/selectable-attestation-attributes/selectable-attestation-attributes.component";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";
import {DialogResult} from "@features/selectable-presentation/components/selectable-attestation-attributes/model/DialogResult";
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
  templateUrl: './attribute-selection.component.html'
})
export class AttributeSelectionComponent implements OnInit, OnChanges {

  constructor(
    private readonly msoMdocPresentationService: MsoMdocPresentationService,
  ) {
  }

  @Input() scenarioSelection!: ScenarioSelection;
  @Output() attributesCollectedEvent =
    new EventEmitter<InputDescriptor[]>();

  readonly dialog: MatDialog = inject(MatDialog);

  inputDescriptorsByType: { [id: string]: InputDescriptor } = {}

  ngOnInit(): void {
    this.prepareDescriptorsForNonSelectable()
  }

  prepareDescriptorsForNonSelectable() {
    let allAttributesSelections = this.scenarioSelection.selections.filter((selection: AttestationSelection) =>
      selection.attributeSelectionMethod === AttributeSelectionMethod.ALL_ATTRIBUTES
    )
    console.log(allAttributesSelections);

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
        attestationName: attestationName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateInputDescriptorsDictionary(result.data as DialogResult);
    });
  }

  updateInputDescriptorsDictionary(dialogResult: DialogResult) {
    this.inputDescriptorsByType[dialogResult.attestationType as string] = dialogResult.inputDescriptor;
    this.emitDescriptorsEvent();
  }

  emitDescriptorsEvent() {
    let result: InputDescriptor[] = [];
    Object.keys(this.inputDescriptorsByType).forEach((item) => {
      result.push(this.inputDescriptorsByType[item]);
    });
    this.attributesCollectedEvent.emit(result);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputDescriptorsByType = {};
    this.prepareDescriptorsForNonSelectable();
    this.emitDescriptorsEvent();
  }

  fieldsSelected(type: AttestationType): number {
    if (this.inputDescriptorsByType[type as string])
      return this.inputDescriptorsByType[type as string].constraints.fields.length;
    else
      return 0;
  }

  showFieldsSelected(type: AttestationType): boolean {
    if (this.inputDescriptorsByType[type as string])
      return this.inputDescriptorsByType[type as string].constraints.fields.length > 0;
    else
      return false;
  }
}

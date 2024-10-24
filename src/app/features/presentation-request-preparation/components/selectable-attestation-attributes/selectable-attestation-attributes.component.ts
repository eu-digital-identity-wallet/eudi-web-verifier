import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {MsoMdocPresentationService} from "@app/core/services/mso-mdoc-presentation.service";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import {FormSelectableField} from "@core/models/FormSelectableField";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {SharedModule} from "@shared/shared.module";
import {AttestationType} from "@core/models/attestation/AttestationType";
import {MSO_MDOC_BY_TYPE} from "@core/data/MsoMdocDocuments";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {DialogData} from "@features/presentation-request-preparation/components/selectable-attestation-attributes/model/DialogData";

@Component({
  standalone: true,
  selector: 'vc-selectable-attestation-attributes',
  templateUrl: './selectable-attestation-attributes.component.html',
  styleUrls: ['./selectable-attestation-attributes.component.scss'],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatExpansionModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [VerifierEndpointService]
})
export class SelectableAttestationAttributesComponent implements OnInit {

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  @Input() attestationType!: AttestationType;
  @Input() attestationFormat!: AttestationFormat;

  formFields!: FormSelectableField[];
  draftInputDescriptor!: InputDescriptor;
  inputDescriptorText!: string;
  selectedFields: FieldConstraint[] = [];

  constructor(
    private readonly msoMdocPresentationService: MsoMdocPresentationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private dialogRef: MatDialogRef<InputDescriptor>
  ) { }

  ngOnInit(): void {
    this.attestationFormat = this.data.format;
    this.attestationType = this.data.type;
    this.initPresentationModel();
    // Init form from model
    this.formFields = this.extractFormFieldsFromModel()

  }

  initPresentationModel() {
    switch (this.attestationFormat) {
      case AttestationFormat.MSO_MDOC:
        let msomdoc = MSO_MDOC_BY_TYPE[this.attestationType as string];
        this.draftInputDescriptor = this.msoMdocPresentationService.msoMdocInputDescriptorOf(msomdoc, "")
        return
      case AttestationFormat.SD_JWT_VC:
        console.error("Format " + AttestationFormat.SD_JWT_VC + " not suppoerted  yet");
        return []
      case AttestationFormat.JWT_VC_JSON:
        console.error("Format " + AttestationFormat.JWT_VC_JSON + " not suppoerted  yet");
        return []
    }
  }

  handle(data: FormSelectableField) {
    const value = data?.value;
    if (!this.exists(value.path[0])) {
      this.selectedFields.push(value);
    } else if (this.exists(value.path[0])) {
      this.selectedFields = this.selectedFields.filter((item: FieldConstraint) => {
        return String(item.path) !== String(value.path[0]);
      });
    }
    // Update draft presentation with selected fields
    this.draftInputDescriptor.constraints.fields = this.selectedFields;
    // refresh descriptor text from model
    this.inputDescriptorText = this.convertJSONtoString(this.draftInputDescriptor);
    this.changeDetectorRef.detectChanges();
  }

  convertJSONtoString(obj: object) {
    return JSON.stringify(obj, null, '\t');
  }

  exists(path: string) {
    const exists = this.selectedFields.filter((item) => item.path.includes(path));
    return exists.length > 0;
  }

  extractFormFieldsFromModel(): FormSelectableField[] {
    switch (this.attestationFormat) {
      case AttestationFormat.MSO_MDOC:
        let msomdoc = MSO_MDOC_BY_TYPE[this.attestationType as string];
        return msomdoc.attestation.dataSet.map((attr, index) => {
          return {
            id: index,
            label: attr.attribute,
            value: this.msoMdocPresentationService.fieldConstraint(msomdoc.namespace, attr.identifier)
          }
        })
      case AttestationFormat.SD_JWT_VC:
        console.error("Format " + AttestationFormat.SD_JWT_VC + " not suppoerted  yet");
        return []
      case AttestationFormat.JWT_VC_JSON:
        console.error("Format " + AttestationFormat.JWT_VC_JSON + " not suppoerted  yet");
        return []
    }
  }

  trackByFn(_index: number, data: FormSelectableField) {
    return data.id;
  }

  saveSelection() {
     this.dialogRef.close({
       data: {
         attestationType: this.attestationType,
         inputDescriptor: this.draftInputDescriptor
       }
     });
  }
}

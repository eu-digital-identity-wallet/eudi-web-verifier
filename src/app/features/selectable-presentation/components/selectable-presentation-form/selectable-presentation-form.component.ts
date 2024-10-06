import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {DataService} from '@app/core/services/data.service';
import {NavigateService} from '@app/core/services/navigate.service';
import {SelectableFormNextAction} from '../../services/selectable-form-next-action.service';
import {LocalStorageService} from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/general';
import {Modification} from '@app/shared/elements/body-actions/models/modification';
import {BodyActionsService} from '@app/shared/elements/body-actions/body-actions.service';
import {AttestationSelectableModelService} from "@app/core/services/attestation-selectable-model.service";
import {MsoMdocPresentationService} from "@app/core/services/mso-mdoc-presentation.service";
import {MsoMdocAttestation} from "@core/models/attestation/MsoMdocAttestation";
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import {FormSelectableField} from "@core/models/FormSelectableField";

@Component({
  selector: 'vc-create-a-scenario',
  templateUrl: './selectable-presentation-form.component.html',
  styleUrls: ['./selectable-presentation-form.component.scss'],
  providers: [VerifierEndpointService]
})
export class SelectablePresentationFormComponent implements OnInit {

  formFields!: FormSelectableField[];
  buttonMode = 'none';
  attestationModel!: MsoMdocAttestation;
  draftPresentation!: TransactionInitializationRequest;
  presentationDefinitionText!: string;
  selectedFields: FieldConstraint[] = [];
  private readonly navigateService!: NavigateService;
  private readonly localStorageService!: LocalStorageService;
  private readonly bodyActionsService!: BodyActionsService;

  constructor(
    private readonly selectableFormNextAction: SelectableFormNextAction,
    private readonly verifierEndpointService: VerifierEndpointService,
    private readonly attestationSelectableModelService: AttestationSelectableModelService,
    private readonly msoMdocPresentationService: MsoMdocPresentationService,
    private readonly dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
  ) {
    this.navigateService = this.injector.get(NavigateService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.bodyActionsService = this.injector.get(BodyActionsService);

    this.enableNextButton();
  }

  ngOnInit(): void {
    this.localStorageService.remove(constants.ACTIVE_TRANSACTION);
    this.initPresentationModel();
    // Init form from model
    this.formFields = this.extractFormFieldsFromModel()
    this.selectableFormNextAction.subscribe(_ => {
      this.initializePresentationTransaction()
    });
  }

  initPresentationModel() {
    this.attestationModel = this.attestationSelectableModelService.getModel();
    const presentationPurpose = this.attestationSelectableModelService.getPresentationPurpose();
    this.draftPresentation = this.msoMdocPresentationService.presentationOf(this.attestationModel, presentationPurpose, [])
  }

  initializePresentationTransaction() {
    let draftPresentationRequest = this.convertJSONtoString(this.draftPresentation);
    if (draftPresentationRequest) {
      let initializationRequest = JSON.parse(draftPresentationRequest) as TransactionInitializationRequest
      this.verifierEndpointService.initializeTransaction(initializationRequest, (data) => {
        this.buttonMode = 'none';
        this.navigateService.navigateTo('/invoke-wallet');
        this.changeDetectorRef.detectChanges();
      });
    } else {
      console.error('invalid JSON format');
    }
  }

  handle(data: FormSelectableField) {
    const value = data?.value;
    if (!this.isExist(value.path[0])) {
      this.selectedFields.push(value);
    } else if (this.isExist(value.path[0])) {
      this.selectedFields = this.selectedFields.filter((item: FieldConstraint) => {
        return String(item.path) !== String(value.path[0]);
      });
    }
    // Update draft presentation with selected fields
    this.draftPresentation.presentation_definition.input_descriptors[0].constraints.fields = this.selectedFields;
    // refresh PD text from model
    this.presentationDefinitionText = this.convertJSONtoString(this.draftPresentation.presentation_definition);
    this.enableNextButton();
    this.changeDetectorRef.detectChanges();
  }

  convertJSONtoString(obj: object) {
    return JSON.stringify(obj, null, '\t');
  }

  isExist(path: string) {
    const exists = this.selectedFields.filter((item) => item.path.includes(path));
    return exists.length > 0;
  }

  enableNextButton() {
    const modifyData: Modification = {
      id: 'next_button',
      disabled: this.selectedFields == undefined || this.selectedFields.length === 0
    };
    this.bodyActionsService.handelButton$.next(modifyData);
  }

  extractFormFieldsFromModel(): FormSelectableField[] {
    return this.attestationModel.attestation.dataSet.map((attr, index) => {
      return {
        id: index,
        label: attr.attribute,
        value: this.msoMdocPresentationService.fieldConstraint(this.attestationModel.namespace, attr.identifier)
      }
    })
  }

  trackByFn(_index: number, data: FormSelectableField) {
    return data.id;
  }
}

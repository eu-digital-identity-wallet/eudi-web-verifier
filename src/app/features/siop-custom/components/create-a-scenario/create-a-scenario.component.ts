import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { catchError } from 'rxjs';
import { PresentationDefinitionResponse } from '@core/models/presentation-definition-response';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { FieldConstraint } from '../../models/FieldConstraint';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { FormSelectableField } from '@features/siop-custom/models/FormSelectableField';
import { HelperCborSelectableService } from '../../services/helper-cbor-selectable.service';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import { Modification } from '@app/shared/elements/body-actions/models/modification';
import { BodyActionsService } from '@app/shared/elements/body-actions/body-actions.service';
import { Presentation } from '../../models/Presentation';
import { AttestationSelectableModelService } from "@app/core/services/attestation-selectable-model.service";
import { MsoMdocPresentationService } from "@app/core/services/mso-mdoc-presentation.service";
import { MsoMdoc } from "@core/models/msoMdoc";

@Component({
	selector: 'vc-create-a-scenario',
	templateUrl: './create-a-scenario.component.html',
	styleUrls: ['./create-a-scenario.component.scss'],
	providers: [PresentationDefinitionService]
})
export class CreateAScenarioComponent implements OnInit {

	formFields!: FormSelectableField[];
	requestGenerate = false;
	buttonMode = 'none';
  attestationModel!: MsoMdoc;
	draftPresentation!: Presentation;
	presentationDefinitionText!: string;
	selectedFields: FieldConstraint[] = [];
	private readonly navigateService!: NavigateService;
	private readonly helperCborSelectableService!: HelperCborSelectableService;
	private readonly localStorageService!: LocalStorageService;
	private readonly bodyActionsService!: BodyActionsService;
	constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly attestationSelectableModelService: AttestationSelectableModelService,
    private readonly msoMdocPresentationService: MsoMdocPresentationService,
    private readonly dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
	) {
		this.navigateService = this.injector.get(NavigateService);
		this.helperCborSelectableService = this.injector.get(HelperCborSelectableService);
		this.localStorageService = this.injector.get(LocalStorageService);
		this.bodyActionsService = this.injector.get(BodyActionsService);

    this.enableNextButton();
	}

	ngOnInit (): void {
		this.localStorageService.remove(constants.UI_PRESENTATION);
    this.initPresentationModel();
    // Init form from model
    this.formFields = this.extractFormFieldsFromModel()
		this.helperCborSelectableService.goNextStep$.subscribe(_ => {
			this.generateCode();
		});
	}

  initPresentationModel() {
    this.attestationModel = this.attestationSelectableModelService.getModel();
    var presentationPurpose = this.attestationSelectableModelService.getPresentationPurpose();
    this.draftPresentation = this.msoMdocPresentationService.presentationOf(this.attestationModel, presentationPurpose, [])
  }

	generateCode () {
		this.requestGenerate = true;
		if (this.convertJSONtoString(this.draftPresentation)) {
			this.buttonMode = 'loading';
			this.presentationDefinitionService.generateCode(this.convertJSONtoString(this.draftPresentation))
				.pipe(
					catchError((error) => {
						return error;
					})
				)
				.subscribe((data) => {
					this.buttonMode = 'none';
					this.requestGenerate = false;
					this.dataService.setQRCode(data as PresentationDefinitionResponse);
					this.navigateService.navigateTo('/cbor-selectable/verifiable');
					this.changeDetectorRef.detectChanges();
				});
		} else {
			console.log('invalid JSON');
		}
	}
	handle (data: FormSelectableField) {
		const value = data?.value;
		if (!this.isExist(value.path[0])) {
			this.selectedFields.push(value);
		}	else if (this.isExist(value.path[0])) {
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

  convertJSONtoString (obj: object) {
		return JSON.stringify(obj, null, '\t');
	}

	isExist (path: string) {
		const exists = this.selectedFields.filter((item) => item.path.includes(path));
		return exists.length > 0;
	}

	enableNextButton () {
		const modifyData: Modification = {
			id: 'next_button',
			disabled: this.selectedFields == undefined || this.selectedFields.length === 0
		};
		this.bodyActionsService.handelButton$.next(modifyData);
	}

  extractFormFieldsFromModel(): FormSelectableField[] {
    return this.attestationModel.attributes.map( (attr, index) => {
      return {
        id: index,
        label: attr.text,
        value: this.msoMdocPresentationService.fieldConstraint(this.attestationModel, attr.value)
      }
    })
  }
	trackByFn (_index: number, data: FormSelectableField) {
		return data.id;
	}
}

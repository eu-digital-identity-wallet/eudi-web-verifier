import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError } from 'rxjs';
import { PresentationDefinitionResponse } from '@core/models/presentation-definition-response';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { CreateFormService } from '../../services/create-form.service';
import { PID_PRESENTATION_DEFINITION } from '@app/core/data/pid_presentation_definition';
import { DefinitionPath } from '../../models/DefinitionPath';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { CBORFields } from '@app/core/data/cbor_fields';
import { CBORField } from '@app/core/models/CBORFields';
import { HelperCborSelectableService } from '../../services/helper-cbor-selectable.service';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import * as constants from '@core/constants/constants';
import { uuidv4 } from '@app/core/utils/uuid';
import { Modification } from '@app/shared/elements/body-actions/models/modification';
import { BodyActionsService } from '@app/shared/elements/body-actions/body-actions.service';
import { Presentation } from '../../models/Presentation';
@Component({
	selector: 'vc-create-a-scenario',
	templateUrl: './create-a-scenario.component.html',
	styleUrls: ['./create-a-scenario.component.scss'],
	providers: [CreateFormService, PresentationDefinitionService]
})
export class CreateAScenarioComponent implements OnInit {

	form!: FormGroup;
	fields: CBORField[];
	requestGenerate = false;
	buttonMode = 'none';
	readonly initDefinitionObject = JSON.parse(JSON.stringify(PID_PRESENTATION_DEFINITION));
	definition!: Presentation;
	definitionText!: string;
	definitionFields: DefinitionPath[] = [];
	private readonly navigateService!: NavigateService;
	private readonly helperCborSelectableService!: HelperCborSelectableService;
	private readonly localStorageService!: LocalStorageService;
	private readonly bodyActionsService!: BodyActionsService;
	constructor (
    private readonly createFormService: CreateFormService,
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
	) {
		this.definition = this.initDefinitionObject;
		this.definition.nonce = uuidv4();
		this.navigateService = this.injector.get(NavigateService);
		this.helperCborSelectableService = this.injector.get(HelperCborSelectableService);
		this.localStorageService = this.injector.get(LocalStorageService);
		this.bodyActionsService = this.injector.get(BodyActionsService);
		this.form = this.createFormService.form;
		this.fields = CBORFields;
	}
	ngOnInit (): void {
		this.localStorageService.remove(constants.UI_PRESENTATION);
		this.setNextButton();
		this.setFields();
		this.definitionText = this.convertJSONtoString(this.definition.presentation_definition);
		this.helperCborSelectableService.goNextStep$.subscribe(_ => {
			this.generateCode();
		});
	}
	generateCode () {
		this.requestGenerate = true;
		if (this.convertJSONtoString(this.definition)) {
			this.buttonMode = 'loading';
			this.presentationDefinitionService.generateCode(this.convertJSONtoString(this.definition))
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
	handle (data: CBORField) {
		const value = data?.value;
		if (!this.isExist(value.path[0])) {
			this.definitionFields.push(value);
		}	else if (this.isExist(value.path[0])) {
			this.definitionFields = this.definitionFields.filter((item: DefinitionPath) => {
				return String(item.path) !== String(value.path[0]);
			});
		}
		this.setFields();
		this.definitionText = this.convertJSONtoString(this.definition.presentation_definition);
		this.setNextButton();
		this.changeDetectorRef.detectChanges();
	}
	setFields () {
		this.definition.presentation_definition.input_descriptors[0].constraints.fields = this.definitionFields;
	}

	convertJSONtoString (obj: object) {
		return JSON.stringify(obj, null, '\t');
	}
	isExist (path: string) {
		const exists = this.definitionFields.filter((item) => item.path.includes(path));
		return exists.length > 0;
	}
	setNextButton () {
		const modifyData: Modification = {
			id: 'next_button',
			disabled: this.definitionFields.length === 0
		};
		this.bodyActionsService.handelButton$.next(modifyData);
	}

	trackByFn (_index: number, data: CBORField) {
		return data.id;
	}
}

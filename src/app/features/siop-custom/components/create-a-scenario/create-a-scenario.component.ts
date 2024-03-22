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
	definition = {...PID_PRESENTATION_DEFINITION};
	definitionText!: string;
	definitionFields: DefinitionPath[] = [];
	private readonly navigateService!: NavigateService;
	private readonly helperCborSelectableService!: HelperCborSelectableService;
	private readonly localStorageService!: LocalStorageService;
	constructor (
    private readonly createFormService: CreateFormService,
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
	) {
		this.definition.nonce = uuidv4();
		this.navigateService = this.injector.get(NavigateService);
		this.helperCborSelectableService = this.injector.get(HelperCborSelectableService);
		this.localStorageService = this.injector.get(LocalStorageService);
		this.form = this.createFormService.form;
		this.fields = CBORFields;
	}
	ngOnInit (): void {
		this.localStorageService.remove(constants.UI_PRESENTATION);
		const requiredFields = this.getFields()
			.filter((item) => item.filter );
		requiredFields.forEach((item: DefinitionPath) => {
			this.definitionFields.push(item);
		});
		this.setFields();
		this.definitionText = this.convertJSONtoString();
		this.helperCborSelectableService.goNextStep$.subscribe(_ => {
			this.generateCode();
		});
	}
	generateCode () {
		this.requestGenerate = true;
		if (this.definitionText) {
			this.buttonMode = 'loading';
			this.presentationDefinitionService.generateCode(this.definitionText)
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
		this.definitionText = this.convertJSONtoString();
		this.changeDetectorRef.detectChanges();
	}
	setFields () {
		this.definition.presentation_definition.input_descriptors[0].constraints.fields = this.definitionFields;
	}
	getFields () {
		return this.definition.presentation_definition.input_descriptors[0].constraints.fields;
	}
	convertJSONtoString () {
		return JSON.stringify(this.definition, null, '\t');
	}
	isExist (path: string) {
		const exists = this.definitionFields.filter((item) => item.path.includes(path));
		return exists.length > 0;
	}

	trackByFn (_index: number, data: CBORField) {
		return data.id;
	}
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
	constructor (
    private readonly createFormService: CreateFormService,
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly navigateService: NavigateService
	) {
		this.form = this.createFormService.form;
		this.fields = CBORFields;
	}
	ngOnInit (): void {
		const requiredFields = this.definition.presentation_definition.input_descriptors[0].constraints.fields
			.filter((item) => item.filter );
		requiredFields.forEach((item: DefinitionPath) => {
			this.definitionFields.push(item);
		});
		this.definitionText = JSON.stringify(this.definition, null, '\t');
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
		this.definition.presentation_definition.input_descriptors[0].constraints.fields = this.definitionFields;
		this.definitionText = JSON.stringify(this.definition, null, '\t');
		this.changeDetectorRef.detectChanges();
	}
	isExist (path: string) {
		const exists = this.definitionFields.filter((item) => item.path.includes(path));
		return exists.length > 0;
	}

	trackByFn (_index: number, data: CBORField) {
		return data.id;
	}
}

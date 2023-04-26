import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PresentationDefinitionResponse } from '../../models/presentation-definition-response';
import { Observable } from 'rxjs';
import { PresentationDefinitionService } from '../../services/presentation-definition.service';

@Component({
	selector: 'vc-verifiable-credential',
	templateUrl: './verifiable-credential.component.html',
	styleUrls: ['./verifiable-credential.component.scss']
})
export class VerifiableCredentialComponent {

	constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService
	) {}

  @Input() presentationDefinition!: Observable<PresentationDefinitionResponse>;
  @Output() requestCredential: EventEmitter<boolean> = new EventEmitter();
  obtainCredential (request_uri: string) {
  	this.requestCredential.emit(true);
  	this.presentationDefinitionService.requestCredentialByJWT(request_uri);

  }
}

import {Injectable} from "@angular/core";
import {Attribute, MsoMdoc} from "@core/models/MsoMdoc";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MsoMdocPresentationService {

  presentationOf(document: MsoMdoc, presentationPurpose: string, includeAttributes?: string[]): TransactionInitializationRequest {
    return {
      type: 'vp_token',
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: [{
          id: document.doctype,
          name: document.name,
          purpose: presentationPurpose,
          format: {
            'mso_mdoc': {
              'alg': [
                "ES256",
                "ES384",
                "ES512"
              ]
            }
          },
          constraints: {
            fields: this.fieldConstraints(document, includeAttributes)
          }
        }]
      },
      nonce: uuidv4()
    };
  }

  fieldConstraints(document: MsoMdoc, includeAttributes?: string[]): FieldConstraint[] {
    const fieldConstraints: FieldConstraint[] = [];
    document.attributes.forEach((attribute: Attribute) => {
      if (typeof includeAttributes == 'undefined' || includeAttributes.includes(attribute.value)) {
        fieldConstraints.push(this.fieldConstraint(document, attribute.value));
      }
    })
    return fieldConstraints;
  }

  fieldConstraint(document: MsoMdoc, attribute: string, intentToRetainOptional?: boolean): FieldConstraint {
    let intentToRetain = false;
    if (typeof intentToRetainOptional !== 'undefined' && intentToRetainOptional) {
      intentToRetain = true
    }
    return {
      path: ['$[\''+document.namespace+'\'][\''+attribute+'\']'],
      intent_to_retain: intentToRetain
    }
  }

}

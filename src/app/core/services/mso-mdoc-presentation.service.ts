import {Injectable} from "@angular/core";
import {Attribute, MsoMdoc} from "@core/models/msoMdoc";
import {Presentation} from "@features/siop-custom/models/Presentation";
import {FieldConstraint} from "@features/siop-custom/models/FieldConstraint";
import {uuidv4} from "@core/utils/uuid";

@Injectable({
  providedIn: 'root'
})
export class MsoMdocPresentationService {

  fieldConstraint(document: MsoMdoc, attribute: string, intentToRetain: boolean): FieldConstraint {
    return {
      path: ['$[\''+document.namespace+'\'][\''+attribute+'\']'],
      intent_to_retain: intentToRetain
    }
  }

  fieldConstraints(document: MsoMdoc, includeAttributes?: string[]): FieldConstraint[] {
    var fieldConstraints: FieldConstraint[] = []
    document.attributes.forEach((attribute: Attribute) => {
      if (typeof includeAttributes == 'undefined' || includeAttributes.includes(attribute.value)) {
        fieldConstraints.push(this.fieldConstraint(document, attribute.value, false));
      }
    })
    return fieldConstraints;
  }

  presentationOf(document: MsoMdoc, includeAttributes?: string[]): Presentation {
    return {
      type: 'vp_token',
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: [{
          id: document.doctype,
          name: document.name,
          purpose: document.presentationPurpose,
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
}
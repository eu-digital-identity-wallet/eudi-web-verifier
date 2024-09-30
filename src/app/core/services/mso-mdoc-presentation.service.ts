import {Injectable} from "@angular/core";
import {Attribute, MsoMdoc} from "@core/models/MsoMdoc";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import {v4 as uuidv4} from 'uuid';
import {AGE_OVER_18_MSO_MDOC, MDL_MSO_MDOC, PID_MSO_MDOC} from "@core/data/MsoMdocDocuments";

@Injectable({
  providedIn: 'root'
})
export class MsoMdocPresentationService {

  presentationOfFullPid(): TransactionInitializationRequest {
    const presentationPurpose = 'We need to verify your identity';
    return this.presentationOf(PID_MSO_MDOC, presentationPurpose);
  }

  presentationOfFullMdl(): TransactionInitializationRequest {
    const presentationPurpose = 'We need to verify your mobile driving licence';
    return this.presentationOf(MDL_MSO_MDOC, presentationPurpose)
  }

  presentationOfPidOver18(): TransactionInitializationRequest {
    const presentationPurpose = 'We need to verify you are over 18 using your PID';
    return this.presentationOf(PID_MSO_MDOC, presentationPurpose, ["age_over_18"])
  }

  presentationOfAgeAttestationOver18(): TransactionInitializationRequest {
    const presentationPurpose = 'We need to verify you are over 18';
    return this.presentationOf(AGE_OVER_18_MSO_MDOC, presentationPurpose, ["age_over_18"])
  }

  presentationOf(
    document: MsoMdoc, presentationPurpose: string,
    includeAttributes?: string[]
  ): TransactionInitializationRequest {
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
        fieldConstraints.push(this.fieldConstraint(document.namespace, attribute.value));
      }
    })
    return fieldConstraints;
  }

  fieldConstraint(namespace: string, attribute: string, intentToRetainOptional?: boolean): FieldConstraint {
    let intentToRetain = false;
    if (typeof intentToRetainOptional !== 'undefined' && intentToRetainOptional) {
      intentToRetain = true
    }
    return {
      path: ['$[\'' + namespace + '\'][\'' + attribute + '\']'],
      intent_to_retain: intentToRetain
    }
  }

}

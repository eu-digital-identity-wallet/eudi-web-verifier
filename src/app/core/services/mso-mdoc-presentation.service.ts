import {Injectable} from "@angular/core";
import {MsoMdocAttestation} from "@core/models/attestation/MsoMdocAttestation";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {v4 as uuidv4} from 'uuid';
import {AGE_OVER_18_MSO_MDOC, MDL_MSO_MDOC, PID_MSO_MDOC} from "@core/data/MsoMdocDocuments";
import {InputDescriptor} from "@core/models/presentation/InputDescriptor";
import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import {DataElement} from "@core/models/attestation/Attestation";

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
      document: MsoMdocAttestation,
      presentationPurpose: string,
      includeAttributes?: string[]
  ): TransactionInitializationRequest {
    return {
      type: 'vp_token',
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: [
          this.msoMdocInputDescriptorOf(document, presentationPurpose, includeAttributes)
        ]
      },
      nonce: uuidv4()
    };
  }

  msoMdocInputDescriptorOf(
    document: MsoMdocAttestation,
    presentationPurpose: string,
    includeAttributes?: string[]
  ): InputDescriptor {
    return {
      id: document.doctype,
      name: document.attestation.name,
      purpose: presentationPurpose,
      format: {
        mso_mdoc: {
          alg: [
            "ES256",
            "ES384",
            "ES512"
          ]
        }
      },
      constraints: {
        fields: this.msoMdocFieldConstraints(document, includeAttributes)
      }
    };
  }

  msoMdocFieldConstraints(document: MsoMdocAttestation, includeAttributes?: string[]): FieldConstraint[] {
    const fieldConstraints: FieldConstraint[] = [];
    document.attestation.dataSet.forEach((dataElement: DataElement) => {
      if (typeof includeAttributes == 'undefined' || includeAttributes.includes(dataElement.identifier)) {
        fieldConstraints.push(this.fieldConstraint(document.namespace, dataElement.identifier));
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

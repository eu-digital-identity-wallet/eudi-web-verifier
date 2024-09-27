import {Injectable} from "@angular/core";
import {PID_MSO_MDOC} from '@core/data/MsoMdocDocuments';
import {MDL_MSO_MDOC} from '@core/data/MsoMdocDocuments';
import {MsoMdoc} from "@core/models/MsoMdoc";

@Injectable({
  providedIn: 'root'
})
export class AttestationSelectableModelService {

  private selectableModel: MsoMdoc | null = null;
  private presentationPurpose!: string;

  setPresentationPurpose(presentationPurpose: string) {
    this.presentationPurpose = presentationPurpose;
  }

  setModel(attestation: string) {
    if (attestation == 'MDL') {
      this.selectableModel = MDL_MSO_MDOC;
    } else if (attestation == 'PID') {
      this.selectableModel = PID_MSO_MDOC;
    }
  }

  getModel(): MsoMdoc {
    return JSON.parse(JSON.stringify(this.selectableModel));
  }

  getPresentationPurpose(): string { return this.presentationPurpose}
}

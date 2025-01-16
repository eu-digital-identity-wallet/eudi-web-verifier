import {Injectable} from "@angular/core";
import {PresentedAttestation} from "@core/models/presentation/PresentedAttestation";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {JSONPath} from "jsonpath-plus";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {DecodersRegistryService} from "@core/services/decoders-registry.service";
import {DescriptorMap} from "@core/models/presentation/PresentationSubmission";
import {forkJoin, Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class WalletResponseProcessorService {
  constructor(
    private readonly decoders: DecodersRegistryService,
    private readonly toastrService: ToastrService,
  ) {
  }

  mapVpTokenToAttestations(concludedTransaction: ConcludedTransaction): Observable<PresentedAttestation[]> {
    let presentationSubmission = concludedTransaction.walletResponse.presentation_submission;
    let vpToken: string[] = concludedTransaction.walletResponse.vp_token!!;
    let result: PresentedAttestation[] = []

    let formatsPerPath = this.deductVpTokenItemsFormats(presentationSubmission.descriptor_map)
    let decodings$: Observable<PresentedAttestation>[] = Object.entries(formatsPerPath)
      .map( entry => {
          return this.mapAttestation(entry, vpToken, concludedTransaction)
      }
    )
    return forkJoin(decodings$)
  }

  mapAttestation(entry: [string, string], vpToken: string[], concludedTransaction: ConcludedTransaction): Observable<PresentedAttestation> {
    let sharedAttestation = this.locateInVpToken(entry[0], vpToken)
    if (sharedAttestation === null || typeof sharedAttestation === 'undefined' || sharedAttestation === "") {
      console.log(`Could not match path ${entry[0]} to vp_token array`)
      return of({
        kind: "error" as const,
        format: entry[1] as AttestationFormat,
        reason: `Could not match path ${entry[0]} to vp_token array`
      })
    } else {
      // locate appropriate decoder
      let decoder = this.decoders.decoderOf(entry[1] as AttestationFormat);
      // decode to SharedAttestation
      return decoder.decode(sharedAttestation, concludedTransaction.nonce)
      .pipe(
        catchError( error => {
          console.error(`Error decoding wallet's response for input descriptor ${entry[0]}:`,error)
          this.toastrService.error(error.error, `Error decoding document in ${entry[1]}`)
          return of({
            kind: "error" as const,
            format: entry[1] as AttestationFormat,
            reason: error.error
          })
        })
      )
    }
  }

  deductVpTokenItemsFormats(descriptorMaps: DescriptorMap[]): { [id: string]: string; } {
    let vpTokenFormatsByPath: { [id: string]: string; } = {};
    descriptorMaps.forEach((descriptor) => {
      if (typeof vpTokenFormatsByPath[descriptor.path] === 'undefined' || vpTokenFormatsByPath[descriptor.path] === null) {
        vpTokenFormatsByPath[descriptor.path] = descriptor.format
      } else if (vpTokenFormatsByPath[descriptor.path] !== descriptor.format) {
        console.error("INVALID_PRESENTATION_SUBMISSION: Descriptor maps of different formats mapped to same path (" + descriptor.path + ")")
      }
    })
    return vpTokenFormatsByPath
  }

  private locateInVpToken(path: string, vpToken: string[]) {
    // locate item in vp_token array
    if (path === "$") {
      return vpToken[0];
    } else {
      let arrayAsJson = JSON.parse(JSON.stringify(vpToken))
      return JSONPath({path: path, json: arrayAsJson})[0];
    }
  }
}

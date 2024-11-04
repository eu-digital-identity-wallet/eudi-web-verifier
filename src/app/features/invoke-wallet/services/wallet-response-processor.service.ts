import {Injectable} from "@angular/core";
import {SharedAttestation} from "@core/models/presentation/SharedAttestation";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";
import {JSONPath} from "jsonpath-plus";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {DecodersRegistryService} from "@core/services/decoders-registry.service";
import {DescriptorMap} from "@core/models/presentation/PresentationSubmission";

@Injectable()
export class WalletResponseProcessorService {
  constructor(
    private readonly decoders: DecodersRegistryService,
  ) {
  }

  mapVpTokenToAttestations(concludedTransaction: ConcludedTransaction): SharedAttestation[] {
    let presentationSubmission = concludedTransaction.walletResponse.presentation_submission;
    let vpToken: string[] = concludedTransaction.walletResponse.vp_token!!;
    let arrayAsJson = JSON.parse(JSON.stringify(vpToken))
    let result: SharedAttestation[] = []

    let formatsPerPath = this.deductVpTokenItemsFormats(presentationSubmission.descriptor_map)
    for (let [path, format] of Object.entries(formatsPerPath)) {
      let attestationFormat = format as AttestationFormat;
      // locate item in vp_token array
      let sharedStr;
      if (path === "$") {
        sharedStr = vpToken[0];
      } else {
        sharedStr = JSONPath({path: path, json: arrayAsJson})[0];
      }
      if (sharedStr === null || typeof sharedStr === 'undefined' || sharedStr === "") {
        console.log("Could not match path " + path + " to vp_token array")
      } else {
        // locate appropriate decoder
        let decoder = this.decoders.decoderOf(attestationFormat);
        // decode to SharedAttestation
        result.push( decoder.decode(sharedStr) )
      }
    }
    return result;
  }

  deductVpTokenItemsFormats(descriptorMaps: DescriptorMap[]): { [id: string]: string; } {
    let vpTokenFormatsByPath: { [id: string]: string; } = {};
    descriptorMaps.forEach((descriptor) => {
      console.log(vpTokenFormatsByPath[descriptor.path])
      if (typeof vpTokenFormatsByPath[descriptor.path] === 'undefined' || vpTokenFormatsByPath[descriptor.path] === null) {
        vpTokenFormatsByPath[descriptor.path] = descriptor.format
      } else if (vpTokenFormatsByPath[descriptor.path] !== descriptor.format) {
        console.error("INVALID_PRESENTATION_SUBMISSION: Descriptor maps of different formats mapped to same path (" + descriptor.path + ")")
      }
    })
    return vpTokenFormatsByPath
  }

}

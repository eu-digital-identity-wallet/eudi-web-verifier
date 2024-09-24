import {Injectable} from "@angular/core";
import {SharedAttestation} from "@core/models/presentation/shared-attestation";
import {AttestationFormat} from "@core/models/AttestationFormat";
import {JSONPath} from "jsonpath-plus";
import {ConcludedTransaction} from "@core/models/ConcludedTransaction";
import {DecodersRegistryService} from "@core/services/decoders-registry.service";
import {from, Observable} from "rxjs";

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

    return presentationSubmission.descriptor_map.map((descriptor) => {
      let format = descriptor.format as AttestationFormat;
      // locate item in vp_token array
      let sharedStr = JSONPath({path: descriptor.path, json: arrayAsJson})[0]
      // get appropriate decoder
      let decoder = this.decoders.decoderOf(format);
      // decode to SharedAttestation
      return decoder.decode(sharedStr)
    });
  }

}

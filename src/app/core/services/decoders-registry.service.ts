import {Injectable} from "@angular/core";
import {AttestationFormat} from "@core/models/AttestationFormat";
import {AttestationDecoder} from "@core/services/decoders/AttestationDecoder";
import {MsoMdocAttestationDecoder} from "@core/services/decoders/MsoMdocAttestationDecoder";
import {JwtVcJsonAttestationDecoder} from "@core/services/decoders/JwtVcJsonAttestationDecoder";

@Injectable({
  providedIn: 'root',
})
export class DecodersRegistryService {

  private dictionary: { [id: string] : AttestationDecoder; } = {};

  constructor(
    msoMdocAttestationDecoder: MsoMdocAttestationDecoder,
    jwtVcJsonAttestationDecoder: JwtVcJsonAttestationDecoder
  ) {
    this.dictionary[AttestationFormat.MSO_MDOC] = msoMdocAttestationDecoder;
    this.dictionary[AttestationFormat.JWT_VC_JSON] = jwtVcJsonAttestationDecoder;
    // this.dictionary[AttestationFormat.SD_JWT_VC] = undefined;
  }

  decoderOf(attestationFormat: AttestationFormat): AttestationDecoder {
    return this.dictionary[attestationFormat];
  }

}

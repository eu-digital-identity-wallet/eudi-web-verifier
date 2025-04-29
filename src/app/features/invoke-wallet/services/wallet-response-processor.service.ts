import { Injectable } from '@angular/core';
import { PresentedAttestation } from '@core/models/presentation/PresentedAttestation';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';
import { JSONPath } from 'jsonpath-plus';
import { ConcludedTransaction } from '@core/models/ConcludedTransaction';
import { DecodersRegistryService } from '@core/services/decoders-registry.service';
import { DescriptorMap } from '@core/models/presentation/PresentationSubmission';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DCQLWalletResponse, PrExWalletResponse } from '@app/core/models/WalletResponse';

@Injectable()
export class WalletResponseProcessorService {
  constructor(
    private readonly decoders: DecodersRegistryService,
    private readonly toastrService: ToastrService
  ) {}

  mapVpTokenToAttestations(
    concludedTransaction: ConcludedTransaction
  ): Observable<PresentedAttestation[]> {
    let decodings$: Observable<PresentedAttestation>[] = [];

    if ('input_descriptors' in concludedTransaction.presentationQuery) {
      const prexWalletResponse  = concludedTransaction.walletResponse as PrExWalletResponse
      
      let formatsPerPath = this.deductVpTokenItemsFormats(
        prexWalletResponse.presentation_submission.descriptor_map
      );

      decodings$ = Object.entries(formatsPerPath).map((entry) => {
        return this.mapAttestation(
          entry[0],
          entry[1],
          prexWalletResponse.vp_token,
          concludedTransaction
        );
      });
    } else {
      const dcqlQuery = concludedTransaction.presentationQuery;
      let vpToken: { [id: string]: string } = (
        concludedTransaction.walletResponse as DCQLWalletResponse
      ).vp_token;

      dcqlQuery.credentials.forEach((credential, index) => {
        decodings$.push(
          this.decodeAttestation(
            vpToken[credential.id],
            dcqlQuery.credentials[index].format as AttestationFormat,
            concludedTransaction.nonce
          )
        );
      });
    }
    return forkJoin(decodings$);
  }

  private mapAttestation(
    path: string,
    format: string,
    vpToken: string[],
    concludedTransaction: ConcludedTransaction
  ): Observable<PresentedAttestation> {
    let sharedAttestation = this.locateInVpToken(path, vpToken);
    if (
      sharedAttestation === null ||
      typeof sharedAttestation === 'undefined' ||
      sharedAttestation === ''
    ) {
      console.log(`Could not match path ${path} to vp_token array`);
      return of({
        kind: 'error' as const,
        format: format as AttestationFormat,
        reason: `Could not match path ${path} to vp_token array`,
      });
    } else {
      return this.decodeAttestation(
        sharedAttestation,
        format as AttestationFormat,
        concludedTransaction.nonce
      );
    }
  }

  private decodeAttestation(
    attestation: any,
    format: AttestationFormat,
    nonce: string
  ): Observable<PresentedAttestation> {
    // locate appropriate decoder
    let decoder = this.decoders.decoderOf(format);
    // decode to SharedAttestation
    return decoder.decode(attestation, nonce).pipe(
      catchError((error) => {
        this.toastrService.error(
          error.error,
          `Error decoding document in ${format}`
        );
        return of({
          kind: 'error' as const,
          format: format,
          reason: error.error,
        });
      })
    );
  }

  private deductVpTokenItemsFormats(descriptorMaps: DescriptorMap[]): {
    [id: string]: string;
  } {
    let vpTokenFormatsByPath: { [id: string]: string } = {};
    descriptorMaps.forEach((descriptor) => {
      if (
        typeof vpTokenFormatsByPath[descriptor.path] === 'undefined' ||
        vpTokenFormatsByPath[descriptor.path] === null
      ) {
        vpTokenFormatsByPath[descriptor.path] = descriptor.format;
      } else if (vpTokenFormatsByPath[descriptor.path] !== descriptor.format) {
        console.error(
          'INVALID_PRESENTATION_SUBMISSION: Descriptor maps of different formats mapped to same path (' +
            descriptor.path +
            ')'
        );
      }
    });
    return vpTokenFormatsByPath;
  }

  private locateInVpToken(path: string, vpToken: string[]) {
    // locate item in vp_token array
    if (path === '$') {
      return vpToken[0];
    } else {
      let arrayAsJson = JSON.parse(JSON.stringify(vpToken));
      return JSONPath({ path: path, json: arrayAsJson })[0];
    }
  }
}

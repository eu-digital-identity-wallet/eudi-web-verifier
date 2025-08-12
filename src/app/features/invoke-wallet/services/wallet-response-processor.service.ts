import { Injectable } from '@angular/core';
import { PresentedAttestation } from '@core/models/presentation/PresentedAttestation';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';
import { ConcludedTransaction } from '@core/models/ConcludedTransaction';
import { DecodersRegistryService } from '@core/services/decoders-registry.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

    const dcqlQuery = concludedTransaction.presentationQuery;
    let vpToken: { [id: string]: string } = concludedTransaction.walletResponse.vp_token;

    dcqlQuery.credentials.forEach((credential, index) => {
      decodings$.push(
        this.decodeAttestation(
          vpToken[credential.id],
          dcqlQuery.credentials[index].format as AttestationFormat,
          concludedTransaction.nonce
        )
      );
    });
    
    return forkJoin(decodings$);
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

}

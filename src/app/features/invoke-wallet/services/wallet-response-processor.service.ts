import { Injectable } from '@angular/core';
import { Errored, PresentedAttestation, Single } from '@core/models/presentation/PresentedAttestation';
import { AttestationFormat } from '@core/models/attestation/AttestationFormat';
import { ConcludedTransaction } from '@core/models/ConcludedTransaction';
import { DecodersRegistryService } from '@core/services/decoders-registry.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class WalletResponseProcessorService {
  constructor(
    private readonly decoders: DecodersRegistryService,
    private readonly toastrService: ToastrService
  ) {}

  mapVpTokenToAttestations(
    concludedTransaction: ConcludedTransaction
  ): {[queryId: string]: Observable<(Single | Errored)[]>} {
    const attestationsPerQuery$: {[queryId: string]: Observable<(Single | Errored)[]>} = {};

    const dcqlQuery = concludedTransaction.presentationQuery;
    let vpToken: { [id: string]: string[] } = concludedTransaction.walletResponse.vp_token;

    console.log(concludedTransaction)
    dcqlQuery.credentials.forEach(credentialQuery => {
      
      const a = vpToken[credentialQuery.id]?.map(attestation => {
        return this.decodeAttestation(
            attestation,
            credentialQuery.format as AttestationFormat,
            concludedTransaction.nonce
          )
      });
      
      attestationsPerQuery$[credentialQuery.id] = forkJoin(a).pipe(
        map((attestations) => this.flatten(attestations)),
      );
    });
    return attestationsPerQuery$;
  }

  private flatten(sharedAttestations: PresentedAttestation[]): (Single | Errored)[] {
    let singles: (Single | Errored)[] = []
    sharedAttestations.forEach(it => {
      switch (it.kind) {
        case "enveloped":
          return singles.push(...it.attestations)
        case "single":
          return singles.push(it)
        case "error":
          return singles.push(it)
      }
    })
    return singles
  };

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

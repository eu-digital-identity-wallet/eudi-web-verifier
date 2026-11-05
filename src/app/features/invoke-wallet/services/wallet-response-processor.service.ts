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

    dcqlQuery.credentials.forEach(credentialQuery => {
      const credentialIds = vpToken[credentialQuery.id];
      if (!credentialIds?.length) {
        return;
      }

      const a = credentialIds.map(attestation => {
        return this.decodeAttestation(
            attestation,
            credentialQuery.format as AttestationFormat,
            concludedTransaction.nonce,
            concludedTransaction.origin
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
    nonce: string,
    origin?: string
  ): Observable<PresentedAttestation> {
    // locate appropriate decoder
    let decoder = this.decoders.decoderOf(format);
    // decode to SharedAttestation
    return decoder.decode(attestation, nonce, origin).pipe(
      catchError((error) => {
        const reason = this.toErrorMessage(error);
        this.toastrService.error(
          reason,
          `Error decoding document in ${format}`
        );
        return of({
          kind: 'error' as const,
          format: format,
          reason: reason,
        });
      })
    );
  }

  private toErrorMessage(error: any): string {
    const body = error?.error;
    if (typeof body === 'string' && body) {
      return body;
    }
    if (body && typeof body === 'object') {
      return this.formatErrorBody(body);
    }
    return error?.message ?? 'Unknown error';
  }

  private formatErrorBody(body: any): string {
    if (Array.isArray(body)) {
      return body
        .map((e: any) => e?.description ?? e?.error ?? JSON.stringify(e))
        .join('; ');
    }
    if (typeof body.type === 'string') {
      return this.formatValidationError(body);
    }
    return JSON.stringify(body);
  }

  private formatValidationError(body: any): string {
    const invalidDocuments = Array.isArray(body.invalidDocuments) ? body.invalidDocuments : [];
    const details = invalidDocuments
      .map((doc: any) => `${doc.documentType}: ${(doc.errors ?? []).join(', ')}`)
      .join('; ');
    return details ? `${body.type} - ${details}` : body.type;
  }

}

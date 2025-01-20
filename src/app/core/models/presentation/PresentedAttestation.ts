import {KeyValue} from "@angular/common";
import {AttestationFormat} from "@core/models/attestation/AttestationFormat";

export type PresentedAttestation = Errored | Single | Enveloped

export type Single = {
  kind: 'single',
  format: AttestationFormat,
  name: string,
  attributes: KeyValue<string, string>[],
  metadata: KeyValue<string, string>[]
}

export type Enveloped = {
  kind: 'enveloped',
  attestations: Single[]
}

export type Errored = {
  kind: 'error',
  format: AttestationFormat,
  reason: string
}

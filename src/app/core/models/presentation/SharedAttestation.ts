import {KeyValue} from "@angular/common";
import {AttestationFormat} from "@core/models/AttestationFormat";

export type SharedAttestation = Single | Enveloped

export type Single  = {
  kind: 'single',
  format: AttestationFormat,
  name: string,
  attributes: KeyValue<string, string>[],
  metadata: KeyValue<string, string>[]
}

export type Enveloped  = {
  kind: 'enveloped',
  attestations: Single[]
}

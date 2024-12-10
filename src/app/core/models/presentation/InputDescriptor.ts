import { Constraint } from './Constraint';

export type InputDescriptor = {
  id: string,
  name?: string,
  purpose?: string,
  format?: Format,
  constraints: Constraint
}

export type Format = {
  jwt_vc_json?: {
    proof_type: string[]
  },
  mso_mdoc?: {
    alg: string[]
  },
  "vc+sd-jwt"?: {
    "sd-jwt_alg_values": string[],
    "kb-jwt_alg_values": string[]
  }
}

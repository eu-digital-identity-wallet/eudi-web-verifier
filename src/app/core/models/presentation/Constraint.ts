import { FieldConstraint } from './FieldConstraint';

export type Constraint = {
  limit_disclosure?: 'required' | 'preferred',
  fields: FieldConstraint[]
}

import {FieldConstraint} from "@core/models/presentation/FieldConstraint";
import { ClaimsQuery } from "./dcql/DCQL";

export type FormSelectableField = {
  id: number,
  label: string,
  value: FieldConstraint,
  dcqlClaim: ClaimsQuery,
  visible?: boolean
}

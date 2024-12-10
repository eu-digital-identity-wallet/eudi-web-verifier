import {FieldConstraint} from "@core/models/presentation/FieldConstraint";

export type FormSelectableField = {
  id: number,
  label: string,
  value: FieldConstraint,
  visible?: boolean
}

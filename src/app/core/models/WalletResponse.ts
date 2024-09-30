import {PresentationSubmission} from "@core/models/presentation/PresentationSubmission";

export type WalletResponse = {
  presentation_submission: PresentationSubmission,
  vp_token?: string[],
  id_token?: string
}

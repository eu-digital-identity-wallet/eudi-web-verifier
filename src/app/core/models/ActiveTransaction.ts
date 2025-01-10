import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";
import {InitializedTransaction} from "@core/models/InitializedTransaction";

export type ActiveTransaction = {
  initialized_transaction: InitializedTransaction,
  initialization_request: TransactionInitializationRequest
}

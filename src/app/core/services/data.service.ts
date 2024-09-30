import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InitializedTransaction } from '../models/InitializedTransaction';
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";

@Injectable({
	providedIn: 'root'
})
export class DataService {

	presentationDefinitionRequest$: Subject<string> = new Subject();

	private _initializationRequest?: TransactionInitializationRequest | null = null;
  get initializationRequest() {
    return this._initializationRequest;
  }
  setInitializationRequest(request: TransactionInitializationRequest | null) {
    this._initializationRequest = request;
  }

	private _initializedTransaction?: InitializedTransaction | null = null;
	get initializedTransaction() {
		return this._initializedTransaction;
	}
	setInitializedTransaction(transaction: InitializedTransaction | null) {
		this._initializedTransaction = transaction;
	}
}

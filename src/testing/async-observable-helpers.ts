import { defer } from 'rxjs';

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
export function asyncData<T> (data: T) {
	return defer(() => Promise.resolve(data));
}

/**
 * Create async observable error that errors
 * after a JS engine turn
 */
export function asyncError<T> (errorObject: T) {
	return defer(() => Promise.reject(errorObject));
}

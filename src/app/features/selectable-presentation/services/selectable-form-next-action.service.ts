import { Injectable } from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class SelectableFormNextAction {

  /**
   * Next button subject that holds the action to be executed when next button is clicked
   */
	private goNextStep$: Subject<string> = new Subject();

  /**
   * An array to hold our subscriptions
   */
  private subscriptions$: Array<Subscription> = new Array<Subscription>()

  subscribe(observerOrNext: (value: string) => void) {
    this.subscriptions$.push(
      this.goNextStep$.subscribe(observerOrNext)
    )
  }

  next(goNext: string) {
    this.goNextStep$.next(goNext)
  }

  /**
   * Unsubscribes all subscriptions of goNextStep$ Subject
   */
  clear() {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

}

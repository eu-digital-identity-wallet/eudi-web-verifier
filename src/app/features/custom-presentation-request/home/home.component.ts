import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DataService} from '@core/services/data.service';
import {NavigateService} from '@core/services/navigate.service';
import {NavigationEnd, Router} from '@angular/router';
import {BodyAction} from '@shared/elements/body-actions/models/BodyAction';
import {PRESENTATION_ACTIONS} from '@core/constants/pages-actions';
import {ActionCode} from '@shared/elements/body-actions/models/ActionCode';
import {VerifierEndpointService} from "@core/services/verifier-endpoint.service";
import {TransactionInitializationRequest} from "@core/models/TransactionInitializationRequest";

@Component({
  selector: 'vc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();
  actions: BodyAction[] = PRESENTATION_ACTIONS;
  requestCode = '';

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly verifierEndpointService: VerifierEndpointService
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.dataService.presentationDefinitionRequest$.subscribe((code) => {
      this.requestCode = code;
      this.disableNextButton(code);
    });
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        if (event.url.includes('custom-request/create')) {
          this.actions = PRESENTATION_ACTIONS;
          this.requestCode = '';
          this.disableNextButton(this.requestCode);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  runActions(data: BodyAction) {
    if (data.code === ActionCode.BACK) {
      this.navigateService.goBack();
    } else if (data.code === ActionCode.NEXT) {
      this.initializePresentationTransaction();
    }
  }

  initializePresentationTransaction() {
    if (this.requestCode) {
      let request = JSON.parse(this.requestCode) as TransactionInitializationRequest
      this.verifierEndpointService.initializeTransaction(request, (_) => {
        this.hideNextStep();
        this.navigateService.navigateTo('/custom-request/invoke');
        this.changeDetectorRef.detectChanges();
      });
    } else {
      console.error('invalid JSON format');
    }
  }

  private disableNextButton(code: string) {
    [...this.actions].map((item: BodyAction) => {
      if (code && item.code == ActionCode.NEXT) {
        item.disabled = false;
      } else if (item.code == ActionCode.NEXT) {
        item.disabled = true;
      }
      return item;
    });
  }

  private hideNextStep() {
    this.actions = this.actions.filter((item: BodyAction) => item.code !== ActionCode.NEXT);
  }
}

import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BodyAction } from './models/BodyAction';
import { Modification } from './models/modification';
import { BodyActionsService } from './body-actions.service';

@Component({
	selector: 'vc-body-actions',
	templateUrl: './body-actions.component.html',
	styleUrls: ['./body-actions.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class BodyActionsComponent implements OnInit {

  @Input() actions: BodyAction[] = [];
  @Output() clicked: EventEmitter<BodyAction> = new EventEmitter();

  constructor (
    private readonly bodyActionsService: BodyActionsService,
    private readonly cd: ChangeDetectorRef
  ) {}
  ngOnInit (): void {
  	this.bodyActionsService.handelButton$
  		.pipe(
  			tap((data: Modification) => this.handelButton(data))
  		)
  		.subscribe();
  }
  runClick (action: BodyAction) {
  	this.clicked.emit(action);
  }
  handelButton (data: Modification) {
  	this.actions.map((item: BodyAction) => {
  		if (item.id === data.id) {
  			item.disabled = data.disabled;
  		}
  		return item;
  	});
  	this.cd.detectChanges();
  }
}
